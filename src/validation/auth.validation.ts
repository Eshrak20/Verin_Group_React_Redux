import z from "zod";

const validEmailSchema = z
  .string()
  .trim()
  .max(254, "Email address must be 254 characters or fewer.")
  .email("Please enter a valid email address.")
  .regex(
    /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,}|xn--[A-Z0-9-]{2,})$/i,
    "Enter a complete email address with a valid domain extension, such as .com, .bd, or .org.",
  );

export const loginSchema = z.object({
  email: validEmailSchema,
  password: z.string().min(1, "Please enter your password"),
});

export const forgotPasswordSchema = z.object({
  email: validEmailSchema,
});

export const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),

    email: validEmailSchema,

    password: z.string().min(8, "Password must be at least 8 characters"),

    password_confirmation: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export const verifyOtpSchema = z.object({
  email: validEmailSchema,
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
}); 

export const resetPasswordSchema = z
    .object({
        email: validEmailSchema,
        otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit OTP."),
        password: z.string().min(8, "Password must be at least 8 characters."),
        password_confirmation: z
            .string()
            .min(1, "Please confirm your password."),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords do not match.",
        path: ["password_confirmation"],
    });