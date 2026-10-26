import AuthShell from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { setAuthCookies } from "@/lib/authCookie";
import { useResendOtpMutation, useVerifyOtpMutation } from "@/redux/auth.api";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials } from "@/redux/slices/auth.slice";
import { formatTime } from "@/utils";
import { verifyOtpSchema } from "@/validation/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock3, Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;

const OTP_EXPIRY_SECONDS = 30;

const getOtpExpiryKey = (email: string) =>
    `verify_otp_expiry:${email.trim().toLowerCase()}`;

const VerifyOtp = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const initialEmail = location.state?.email as string | undefined;

    const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();

    const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitted },
    } = useForm<VerifyOtpFormValues>({
        resolver: zodResolver(verifyOtpSchema),
        mode: "onSubmit",
        defaultValues: {
            email: initialEmail ?? "",
            otp: "",
        },
    });

    const email = (useWatch({ control, name: "email" }) ?? "").trim();
    const isValidEmail = verifyOtpSchema.shape.email.safeParse(email).success;
    const expiryKey = isValidEmail ? getOtpExpiryKey(email) : null;
    const initialEmailIsValid = verifyOtpSchema.shape.email.safeParse(
        initialEmail ?? "",
    ).success;
    const initialExpiryKey = initialEmailIsValid && initialEmail
        ? getOtpExpiryKey(initialEmail)
        : null;

    const getRemainingSeconds = (key: string | null) => {
        if (!key) return 0;

        const storedExpiry = sessionStorage.getItem(key);
        if (!storedExpiry) return 0;

        const expiry = Number(storedExpiry);

        if (!Number.isFinite(expiry)) return 0;

        return Math.max(0, Math.ceil((expiry - Date.now()) / 1000));
    };

    const [timerState, setTimerState] = useState(() => {
        if (initialExpiryKey && !sessionStorage.getItem(initialExpiryKey)) {
            sessionStorage.setItem(
                initialExpiryKey,
                String(Date.now() + OTP_EXPIRY_SECONDS * 1000),
            );
        }

        return {
            key: initialExpiryKey,
            seconds: getRemainingSeconds(initialExpiryKey),
        };
    });
    const remainingSeconds =
        timerState.key === expiryKey
            ? timerState.seconds
            : getRemainingSeconds(expiryKey);

    useEffect(() => {
        if (!expiryKey) return;

        const timer = window.setInterval(() => {
            setTimerState({
                key: expiryKey,
                seconds: getRemainingSeconds(expiryKey),
            });
        }, 1000);

        return () => window.clearInterval(timer);
    }, [expiryKey]);

    const otpValue = useWatch({ control, name: "otp" }) ?? "";
    const isOtpComplete = /^\d{6}$/.test(otpValue);

    const onSubmit = async (data: VerifyOtpFormValues) => {
        try {
            const response = await verifyOtp({
                ...data,
                purpose: "email_verification",
            }).unwrap();

            // Clear the expiry timer after successful verification
            if (expiryKey) {
                sessionStorage.removeItem(expiryKey);
            }

            // 🎯 ওটিপি ভেরিফিকেশন ও অটো-লগইন সফল হওয়ার পর লোকাল স্টোরেজের গেস্ট উইশলিস্ট ক্লিয়ার করে দেওয়া হলো
            localStorage.removeItem("guest_wishlist");

             setAuthCookies(response.data.token, "Bearer");

            dispatch(
                setCredentials({
                    user: response.data.user,
                    token: response.data.token,
                    tokenType: "Bearer",
                }),
            );

            toast.success(response.message || "Email verified successfully!");

            navigate("/");
        } catch (error) {
            console.error("OTP verification failed:", error);

            toast.error(
                "OTP verification failed. Please check your details and try again.",
            );
        }
    };

    const handleResendOtp = async () => {
        if (!isValidEmail || remainingSeconds > 0 || isResending) {
            return;
        }

        try {
            const response = await resendOtp({
                email,
                purpose: "email_verification",
            }).unwrap();

            toast.success(response.message || "A new OTP has been sent!");

            const expiry = Date.now() + OTP_EXPIRY_SECONDS * 1000;
            const nextExpiryKey = getOtpExpiryKey(email);
            sessionStorage.setItem(nextExpiryKey, String(expiry));
            setTimerState({
                key: nextExpiryKey,
                seconds: OTP_EXPIRY_SECONDS,
            });
        } catch (error) {
            console.error("Resending OTP failed:", error);

            toast.error("Failed to resend OTP. Please try again.");
        }
    };

    return (
        <AuthShell>
            <div className="w-full space-y-7">
                <div className="space-y-2.5 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
                        <ShieldCheck className="size-6 text-primary" />
                    </div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-primary">
                        Email verification
                    </p>
                    <h1 className="text-3xl font-normal text-foreground sm:text-[2rem]">
                        Verify your email
                    </h1>

                    <p className="text-sm leading-6 text-muted-foreground">
                        Enter the 6-digit verification code sent to you.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                    <Field data-invalid={!!errors.email}>
                        <FieldLabel
                            htmlFor="email"
                            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Email
                        </FieldLabel>

                        <Input
                            id="email"
                            type="email"
                            disabled={isVerifying || isResending}
                            aria-invalid={!!errors.email}
                            autoComplete="email"
                            placeholder="jane@example.com"
                            className="h-11 rounded-xl border-border bg-secondary/30 px-4 text-sm disabled:opacity-100"
                            {...register("email")}
                        />

                        {errors.email && <FieldError errors={[errors.email]} />}
                    </Field>

                    <Field data-invalid={!!errors.otp}>
                        <FieldLabel
                            htmlFor="otp"
                            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Verification code
                        </FieldLabel>

                        <Controller
                            name="otp"
                            control={control}
                            render={({ field }) => (
                                <InputOTP
                                    maxLength={6}
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    disabled={isVerifying}
                                    aria-invalid={!!errors.otp}
                                    inputMode="numeric"
                                    pattern="^[0-9]+$">
                                    <InputOTPGroup className="gap-3">
                                        {Array.from({ length: 6 }, (_, index) => (
                                            <InputOTPSlot
                                                key={index}
                                                index={index}
                                                className="size-11 rounded-xl border border-border bg-secondary/30 text-base first:rounded-xl last:rounded-xl"
                                            />
                                        ))}
                                    </InputOTPGroup>
                                </InputOTP>
                            )}
                        />

                        {isSubmitted && errors.otp && <FieldError errors={[errors.otp]} />}
                    </Field>

                    <div className="space-y-3 text-center">
                        <p className="text-sm text-muted-foreground">
                            Didn't receive the code?
                        </p>
                        {remainingSeconds > 0 && (
                            <p
                                aria-live="polite"
                                className="mx-auto flex w-fit items-center gap-2 rounded-full bg-secondary/60 px-3.5 py-1.5 text-xs text-muted-foreground">
                                <Clock3 className="size-3.5 text-primary" />
                                Resend available in
                                <span className="font-semibold tabular-nums text-foreground">
                                    {formatTime(remainingSeconds)}
                                </span>
                            </p>
                        )}

                        <Button
                            type="button"
                            variant="outline"
                            className="h-11 w-full rounded-xl border-border bg-transparent text-sm"
                            disabled={remainingSeconds > 0 || isResending || !isValidEmail}
                            onClick={handleResendOtp}>
                            {isResending ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Resending OTP...
                                </>
                            ) : (
                                "Resend OTP"
                            )}
                        </Button>
                    </div>

                    <Button
                        type="submit"
                        disabled={!isOtpComplete || isVerifying || isResending}
                        className="h-12 w-full rounded-xl bg-[#2b2420] text-sm font-semibold text-[#f7f2e7] hover:bg-[#403630]">
                        {isVerifying ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            "Verify OTP"
                        )}
                    </Button>
                </form>
            </div>
        </AuthShell>
    );
};

export default VerifyOtp;