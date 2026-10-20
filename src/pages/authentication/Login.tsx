import AuthShell from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { setAuthCookies } from "@/lib/authCookie";
import { useLoginMutation } from "@/redux/auth.api";
import { setCredentials } from "@/redux/slices/auth.slice";
import type { AppDispatch } from "@/redux/store";
import { loginSchema } from "@/validation/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login = () => {
    const companyName = "Verin Group";
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loginUser, { isLoading }] = useLoginMutation();
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const response = await loginUser(data).unwrap();

            console.log("Login response:", response);

            setAuthCookies(response.data.token, "Bearer");

            dispatch(
                setCredentials({
                    user: response.data.user,
                    token: response.data.token,
                    tokenType: "Bearer",
                }),
            );

            toast.success(response.message || "Welcome back!");

            console.log("Navigating to dashboard...");
            navigate("/dashboard", { replace: true });
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Login failed. Please check your email and password.");
        }
    };

    return (
        <AuthShell>
            <div className="w-full space-y-7">
                <div className="space-y-2.5 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-primary">
                        Welcome back
                    </p>
                    <h2 className="text-3xl font-normal text-foreground sm:text-[2rem]">
                        Sign in to {companyName}
                    </h2>
                    <p className="text-sm leading-6 text-muted-foreground">
                        Access your {companyName} account.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                    <Field data-invalid={!!errors.email}>
                        <FieldLabel
                            htmlFor="login-email"
                            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Email
                        </FieldLabel>
                        <Input
                            id="login-email"
                            type="email"
                            autoComplete="email"
                            placeholder="jane@example.com"
                            disabled={isLoading}
                            aria-invalid={!!errors.email}
                            className="h-11 rounded-xl border-border bg-secondary/30 px-4 text-sm placeholder:text-muted-foreground/60"
                            {...register("email")}
                        />
                        {errors.email && <FieldError errors={[errors.email]} />}
                    </Field>

                    <Field data-invalid={!!errors.password}>
                        <FieldLabel
                            htmlFor="login-password"
                            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Password
                        </FieldLabel>
                        <div className="relative">
                            <Input
                                id="login-password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                disabled={isLoading}
                                aria-invalid={!!errors.password}
                                className="h-11 rounded-xl border-border bg-secondary/30 px-4 pr-12 text-sm placeholder:text-muted-foreground/60"
                                {...register("password")}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 size-8 -translate-y-1/2 rounded-lg text-muted-foreground hover:bg-transparent hover:text-foreground"
                                onClick={() => setShowPassword((value) => !value)}
                                disabled={isLoading}
                                aria-label={showPassword ? "Hide password" : "Show password"}>
                                {showPassword ? (
                                    <EyeOff className="size-4" />
                                ) : (
                                    <Eye className="size-4" />
                                )}
                            </Button>
                        </div>
                        {errors.password && <FieldError errors={[errors.password]} />}

                        <div className="flex justify-end">
                            <Link
                                to="/forgot-password"
                                state={{ email: getValues("email").trim() }}
                                className="text-sm text-primary underline-offset-4 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                    </Field>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="mt-2 h-12 w-full rounded-xl bg-[#2b2420] text-sm font-semibold text-[#f7f2e7] hover:bg-[#403630]">
                        {isLoading ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign in
                                <ArrowRight className="ml-1 size-4" />
                            </>
                        )}
                    </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    New to {companyName}?{" "}
                    <Link
                        to="/register"
                        className="font-semibold text-primary transition-colors hover:text-[#9f3b12]">
                        Create an account
                    </Link>
                </p>
            </div>
        </AuthShell>
    );
};

export default Login
