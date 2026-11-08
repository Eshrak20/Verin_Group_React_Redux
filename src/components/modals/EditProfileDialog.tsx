import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { useUpdateProfileMutation } from "@/redux/auth.api";
import type { VerifyOtpProfile, VerifyOtpUser } from "@/types/auth.type";
import { CalendarDays, Loader2, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EditProfileDialogProps {
    user: VerifyOtpUser;
    profile: VerifyOtpProfile;
}

interface ProfileForm {
    name: string;
    phone: string;
    date_of_birth: string;
    gender: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    occupation: string;
}

const createFormData = (
    user: VerifyOtpUser,
    profile: VerifyOtpProfile,
): ProfileForm => ({
    name: user.name ?? "",
    phone: profile.phone ?? "",
    date_of_birth: profile.date_of_birth?.slice(0, 10) ?? "",
    gender: profile.gender ?? "",
    address_line_1: profile.address_line_1 ?? "",
    address_line_2: profile.address_line_2 ?? "",
    city: profile.city ?? "",
    state: profile.state ?? "",
    postal_code: profile.postal_code ?? "",
    country: profile.country ?? "",
    occupation:
        typeof profile.metadata?.occupation === "string"
            ? profile.metadata.occupation
            : "",
});

const parseDate = (value: string): Date | undefined => {
    if (!value) return undefined;
    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) return undefined;
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
        ? date
        : undefined;
};

const formatDateInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export function EditProfileDialog({
    user,
    profile,
}: EditProfileDialogProps) {
    const [open, setOpen] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState(false);

    // ইনিশিয়াল স্টেটেই ফর্ম ডাটা সেট করা হয়েছে (useEffect রিমুভ করা হয়েছে)
    const [form, setForm] = useState<ProfileForm>(() =>
        createFormData(user, profile),
    );

    const [updateProfile, { isLoading }] = useUpdateProfileMutation();

    const handleChange = (field: keyof ProfileForm, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await updateProfile({
                name: form.name,
                phone: form.phone,
                date_of_birth: form.date_of_birth,
                gender: form.gender,
                address_line_1: form.address_line_1,
                address_line_2: form.address_line_2,
                city: form.city,
                state: form.state,
                postal_code: form.postal_code,
                country: form.country,
                metadata: {
                    occupation: form.occupation,
                },
            }).unwrap();

            toast.success("Profile updated successfully!");
            setOpen(false);
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        }
    };

    const fields: {
        name: Exclude<
            keyof ProfileForm,
            "date_of_birth" | "gender" | "occupation"
        >;
        label: string;
        placeholder?: string;
    }[] = [
            { name: "name", label: "Full Name", placeholder: "Enter your name" },
            { name: "phone", label: "Phone", placeholder: "Enter phone number" },
            { name: "address_line_1", label: "Address Line 1" },
            { name: "address_line_2", label: "Address Line 2" },
            { name: "city", label: "City" },
            { name: "state", label: "State" },
            { name: "postal_code", label: "Postal Code" },
            { name: "country", label: "Country" },
        ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit Profile
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Update your personal information and contact details.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {fields.map((field) => (
                            <div key={field.name} className="space-y-2">
                                <Label htmlFor={field.name}>{field.label}</Label>
                                <Input
                                    id={field.name}
                                    placeholder={field.placeholder ?? `Enter ${field.label.toLowerCase()}`}
                                    value={form[field.name]}
                                    onChange={(event) =>
                                        handleChange(field.name, event.target.value)
                                    }
                                />
                            </div>
                        ))}

                        {/* Date of Birth */}
                        <div className="space-y-2">
                            <Label>Date of Birth</Label>

                            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className={`w-full justify-start text-left font-normal ${!form.date_of_birth ? "text-muted-foreground" : ""
                                            }`}
                                    >
                                        <CalendarDays className="mr-2 h-4 w-4" />
                                        {parseDate(form.date_of_birth)?.toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        }) ?? "Select your date of birth"}
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-auto p-3" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={parseDate(form.date_of_birth)}
                                        onSelect={(date) => {
                                            handleChange(
                                                "date_of_birth",
                                                date ? formatDateInput(date) : "",
                                            );
                                            setCalendarOpen(false);
                                        }}
                                        captionLayout="dropdown"
                                        disabled={(date) => date > new Date()}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select
                                value={form.gender || undefined}
                                onValueChange={(value) => handleChange("gender", value)}
                            >
                                <SelectTrigger id="gender" className="w-full">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Occupation */}
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="occupation">Occupation</Label>
                            <Input
                                id="occupation"
                                placeholder="Enter your occupation"
                                value={form.occupation}
                                onChange={(event) =>
                                    handleChange("occupation", event.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 border-t pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}