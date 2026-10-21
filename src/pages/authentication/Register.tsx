import AuthShell from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { useRegisterMutation } from "@/redux/auth.api";
import { registerSchema } from "@/validation/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const companyName = "Verin Group";
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const response = await registerUser(data).unwrap();

      toast.success(response.message || "Registration successful!");

      navigate("/register/verify-otp", {
        state: {
          email: data.email,
        },
      }
      );
    } catch (error) {
      console.error("Registration failed:", error);

      toast.error(
        getApiErrorMessage(error)
      );
    }
  };

  return (
    <AuthShell>
      <div className="w-full space-y-7">
        <div className="space-y-2.5 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-primary">
            Join {companyName}
          </p>
          <h2 className=" text-3xl font-normal text-foreground sm:text-[2rem]">
            Create your account
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            `Create an account with {companyName} to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Field data-invalid={!!errors.name}>
            <FieldLabel
              htmlFor="name"
              className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Full name
            </FieldLabel>

            <Input
              id="name"
              type="text"
              placeholder="Jane Doe"
              disabled={isLoading}
              aria-invalid={!!errors.name}
              className="h-11 rounded-xl border-border bg-secondary/30 px-4 text-sm placeholder:text-muted-foreground/60"
              {...register("name")}
            />

            {errors.name && <FieldError errors={[errors.name]} />}
          </Field>

          <Field data-invalid={!!errors.email}>
            <FieldLabel
              htmlFor="email"
              className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Email
            </FieldLabel>

            <Input
              id="email"
              type="email"
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
              htmlFor="password"
              className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Password
            </FieldLabel>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
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
          </Field>

          <Field data-invalid={!!errors.password_confirmation}>
            <FieldLabel
              htmlFor="password_confirmation"
              className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Confirm Password
            </FieldLabel>

            <div className="relative">
              <Input
                id="password_confirmation"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                disabled={isLoading}
                aria-invalid={!!errors.password_confirmation}
                className="h-11 rounded-xl border-border bg-secondary/30 px-4 pr-12 text-sm placeholder:text-muted-foreground/60"
                {...register("password_confirmation")}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 size-8 -translate-y-1/2 rounded-lg text-muted-foreground hover:bg-transparent hover:text-foreground"
                onClick={() => setShowConfirmPassword((value) => !value)}
                disabled={isLoading}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }>
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

          <Button
            type="submit"
            disabled={isLoading}
            className="mt-2 h-12 w-full rounded-xl bg-[#2b2420] text-sm font-semibold text-[#f7f2e7] hover:bg-[#403630]">
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create account
                <ArrowRight className="ml-1 size-4" />
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account with {companyName}?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary transition-colors hover:text-[#9f3b12]">
            Login
          </Link>
        </p>
      </div>
    </AuthShell>
  );
};

export default Register
