import AuthShell from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { useForgotPasswordMutation } from "@/redux/auth.api";
import { forgotPasswordSchema } from "@/validation/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const initialEmail =
        typeof location.state === "object" &&
            location.state !== null &&
            "email" in location.state &&
            typeof location.state.email === "string"
            ? location.state.email
            : "";
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
    const [sentEmail, setSentEmail] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: "onBlur",
        defaultValues: { email: initialEmail },
    });

    const onSubmit = async ({ email }: ForgotPasswordValues) => {
        const normalizedEmail = email.trim();

        try {
            const response = await forgotPassword({ email: normalizedEmail }).unwrap();
            setSentEmail(normalizedEmail);
            console.log("Forgot password request successful:", response);
        } catch (error) {
            console.error("Forgot password request failed:", error);
            toast.error(getApiErrorMessage(error));
        }
    };

    return (
        <>
            <AuthShell>
                <div className="w-full space-y-7">
                    <div className="space-y-2.5 text-center">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-primary">
                            Account recovery
                        </p>
                        <h2 className="text-3xl font-normal text-foreground sm:text-[2rem]">
                            Send code to your email
                        </h2>
                        <p className="text-sm leading-6 text-muted-foreground">
                            Enter the email address linked to your account and we’ll send you a
                            verification code.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                        noValidate>
                        <Field data-invalid={!!errors.email}>
                            <FieldLabel
                                htmlFor="forgot-password-email"
                                className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                Email
                            </FieldLabel>
                            <Input
                                id="forgot-password-email"
                                type="email"
                                autoComplete="email"
                                autoCapitalize="none"
                                spellCheck={false}
                                placeholder="jane@example.com"
                                disabled={isLoading}
                                aria-invalid={!!errors.email}
                                className="h-11 rounded-xl border-border bg-secondary/30 px-4 text-sm placeholder:text-muted-foreground/60"
                                {...register("email")}
                            />
                            {errors.email && <FieldError errors={[errors.email]} />}
                        </Field>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="h-12 w-full rounded-xl bg-[#2b2420] text-sm font-semibold text-[#f7f2e7] hover:bg-[#403630]">
                            {isLoading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Sending code...
                                </>
                            ) : (
                                "Send OTP"
                            )}
                        </Button>
                    </form>

                    <div className="text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                            <ArrowLeft className="size-4" />
                            Back to sign in
                        </Link>
                    </div>
                </div>
            </AuthShell>

            {sentEmail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#2b2420]/80 p-4 sm:p-8">
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="forgot-password-confirmation-title"
                        className="w-full max-w-xl rounded-[28px] border border-border bg-card px-6 py-10 text-center text-card-foreground shadow-2xl sm:px-12 sm:py-14">
                        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-secondary">
                            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <MailCheck className="size-8" strokeWidth={1.8} />
                            </div>
                        </div>

                        <h2
                            id="forgot-password-confirmation-title"
                            className="mt-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Check your email
                        </h2>
                        <p className="mt-4 wrap-break-word text-base leading-7 text-muted-foreground sm:text-lg">
                            We’ve sent a verification code to{" "}
                            <span className="font-semibold text-primary">{sentEmail}</span>
                        </p>

                        <div className="mt-9 rounded-3xl border border-border bg-secondary/50 px-5 py-7 text-base leading-8 text-muted-foreground sm:px-10 sm:py-9 sm:text-lg">
                            Check your email for a verification code. Please check your spam
                            folder too.
                        </div>

                        <Button
                            type="button"
                            className="mt-7 h-11 min-w-32 rounded-xl bg-primary px-8 text-secondary hover:bg-[#403630]"
                            onClick={() =>
                                navigate("/reset-password", {
                                    state: { email: sentEmail },
                                })
                            }>
                            OK
                        </Button>
                    </section>
                </div>
            )}
        </>
    );
};
