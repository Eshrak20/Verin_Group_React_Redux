import AuthShell from "@/components/layout/AuthShell";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { useResetPasswordMutation } from "@/redux/auth.api";
import { resetPasswordSchema } from "@/validation/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowLeft,
    Eye,
    EyeOff,
    Loader2,
    LockKeyhole,
    ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";


type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const initialEmail =
        typeof location.state === "object" &&
            location.state !== null &&
            "email" in location.state &&
            typeof location.state.email === "string"
            ? location.state.email
            : "";

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [resetPassword, { isLoading: isResetting }] =
        useResetPasswordMutation();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitted },
    } = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onSubmit",
        defaultValues: {
            email: initialEmail,
            otp: "",
            password: "",
            password_confirmation: "",
        },
    });

    const otpValue = useWatch({ control, name: "otp" }) ?? "";
    const isOtpComplete = /^\d{6}$/.test(otpValue);

    const onSubmit = async (data: ResetPasswordValues) => {
        try {
            const response = await resetPassword({
                email: data.email.trim(),
                otp: data.otp,
                password: data.password,
                password_confirmation: data.password_confirmation,
            }).unwrap();

            toast.success(
                response.message || "Your password has been reset successfully.",
            );

            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Password reset failed:", error);

            toast.error(
                "Failed to reset your password. Check your OTP and try again.",
            );
        }
    };


    return (
        <AuthShell>
            <div className="space-y-7">
                {/* Header */}
                <div className="space-y-2.5 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
                        <ShieldCheck className="size-6 text-primary" />
                    </div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-primary">
                        Account security
                    </p>

                    <h1 className="text-3xl font-normal text-foreground sm:text-[2rem]">
                        Reset your password
                    </h1>

                    <p className="text-sm leading-6 text-muted-foreground">
                        Enter the verification code sent to your email and choose a new
                        password.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                    noValidate
                >
                    {/* Email */}
                    <Field data-invalid={!!errors.email}>
                        <FieldLabel
                            htmlFor="reset-email"
                            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                        >
                            Email
                        </FieldLabel>

                        <Input
                            id="reset-email"
                            type="email"
                            autoComplete="email"
                            placeholder="Enter your email address"
                            disabled
                            aria-invalid={!!errors.email}
                            className="h-11 rounded-xl border-border bg-secondary/30 px-4 text-sm"
                            {...register("email")}
                        />

                        {errors.email && <FieldError errors={[errors.email]} />}
                    </Field>

                    {/* OTP */}
                    <Field data-invalid={!!errors.otp}>
                        <FieldLabel
                            htmlFor="reset-otp"
                            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                        >
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
                                    disabled={isResetting}
                                    aria-invalid={!!errors.otp}
                                    inputMode="numeric"
                                    pattern="^[0-9]+$"
                                >
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

                        {isSubmitted && errors.otp && (
                            <FieldError errors={[errors.otp]} />
                        )}
                    </Field>

                    {/* New password */}
                    <Field data-invalid={!!errors.password}>
                        <FieldLabel
                            htmlFor="reset-password"
                            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                        >
                            New password
                        </FieldLabel>

                        <div className="relative">
                            <Input
                                id="reset-password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="Enter your new password"
                                disabled={isResetting}
                                aria-invalid={!!errors.password}
                                className="h-11 rounded-xl border-border bg-secondary/30 px-4 pr-12 text-sm"
                                {...register("password")}
                            />

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 size-8 -translate-y-1/2 rounded-lg text-muted-foreground hover:bg-transparent hover:text-foreground"
                                onClick={() => setShowPassword((visible) => !visible)}
                                disabled={isResetting}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff className="size-4" />
                                ) : (
                                    <Eye className="size-4" />
                                )}
                            </Button>
                        </div>

                        {errors.password && <FieldError errors={[errors.password]} />}
                    </Field>

                    {/* Confirm password */}
                    <Field data-invalid={!!errors.password_confirmation}>
                        <FieldLabel
                            htmlFor="reset-password-confirmation"
                            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                        >
                            Confirm password
                        </FieldLabel>

                        <div className="relative">
                            <Input
                                id="reset-password-confirmation"
                                type={showConfirmPassword ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="Confirm your new password"
                                disabled={isResetting}
                                aria-invalid={!!errors.password_confirmation}
                                className="h-11 rounded-xl border-border bg-secondary/30 px-4 pr-12 text-sm"
                                {...register("password_confirmation")}
                            />

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 size-8 -translate-y-1/2 rounded-lg text-muted-foreground hover:bg-transparent hover:text-foreground"
                                onClick={() =>
                                    setShowConfirmPassword((visible) => !visible)
                                }
                                disabled={isResetting}
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide confirm password"
                                        : "Show confirm password"
                                }
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="size-4" />
                                ) : (
                                    <Eye className="size-4" />
                                )}
                            </Button>
                        </div>

                        {errors.password_confirmation && (
                            <FieldError errors={[errors.password_confirmation]} />
                        )}
                    </Field>

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={!isOtpComplete || isResetting}
                        className="h-12 w-full rounded-xl bg-[#2b2420] text-sm font-semibold text-[#f7f2e7] hover:bg-[#403630]"
                    >
                        {isResetting ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Resetting password...
                            </>
                        ) : (
                            <>
                                <LockKeyhole className="size-4" />
                                Reset password
                            </>
                        )}
                    </Button>

                    <div className="text-center">
                        <Link
                            to="/login"
                            className={cn(
                                buttonVariants({ variant: "link" }),
                                "text-sm text-muted-foreground",
                            )}
                        >
                            <ArrowLeft className="size-4" />
                            Back to login
                        </Link>
                    </div>
                </form>
            </div>
        </AuthShell>
    );
};

export default ResetPassword;