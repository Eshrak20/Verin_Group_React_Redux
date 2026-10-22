import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { useChangePasswordMutation } from "@/redux/auth.api";
import type { ChangePasswordRequest } from "@/types/auth.type";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const ChangePasswordDialog = () => {
    const [isOpen, setIsOpen] = useState(false);

    // States for toggling password visibility
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [changePassword, { isLoading: isSubmitting }] =
        useChangePasswordMutation();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<ChangePasswordRequest>();

    const newPasswordValue = watch("password");

    const resetForm = () => {
        reset();
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            resetForm();
        }
    };

    const onSubmit = async (data: ChangePasswordRequest) => {
        try {
            await changePassword(data).unwrap();
            toast.success("Password changed successfully!");
            resetForm();
            setIsOpen(false);
        } catch (err) {
            toast.error(
                getApiErrorMessage(err, "Failed to change password. Please try again.")
            );
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <KeyRound className="h-4 w-4" />
                    Change password
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Change password</DialogTitle>
                    <DialogDescription>
                        Enter your current password and choose a new secure password.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
                    {/* Current Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="current_password">Current password</Label>
                        <div className="relative">
                            <Input
                                id="current_password"
                                type={showCurrentPassword ? "text" : "password"}
                                className="pr-10"
                                {...register("current_password", {
                                    required: "Current password is required",
                                })}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:bg-transparent"
                                onClick={() => setShowCurrentPassword((prev) => !prev)}
                                aria-label={
                                    showCurrentPassword
                                        ? "Hide current password"
                                        : "Show current password"
                                }
                            >
                                {showCurrentPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.current_password && (
                            <p className="text-xs text-destructive">
                                {errors.current_password.message}
                            </p>
                        )}
                    </div>

                    {/* New Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password">New password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showNewPassword ? "text" : "password"}
                                className="pr-10"
                                {...register("password", {
                                    required: "New password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters",
                                    },
                                })}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:bg-transparent"
                                onClick={() => setShowNewPassword((prev) => !prev)}
                                aria-label={
                                    showNewPassword ? "Hide new password" : "Show new password"
                                }
                            >
                                {showNewPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-destructive">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm New Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation">Confirm new password</Label>
                        <div className="relative">
                            <Input
                                id="password_confirmation"
                                type={showConfirmPassword ? "text" : "password"}
                                className="pr-10"
                                {...register("password_confirmation", {
                                    required: "Please confirm your new password",
                                    validate: (value) =>
                                        value === newPasswordValue || "Passwords do not match",
                                })}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:bg-transparent"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide confirmed password"
                                        : "Show confirmed password"
                                }
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.password_confirmation && (
                            <p className="text-xs text-destructive">
                                {errors.password_confirmation.message}
                            </p>
                        )}
                    </div>

                    <DialogFooter className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Update password
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};