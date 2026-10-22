import { ChangePasswordDialog } from "@/components/modals/ChangePasswordModal";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { useGetMyProfileQuery } from "@/redux/auth.api";
import { Calendar, Mail, MapPin, Phone, RefreshCw, User } from "lucide-react";

const formatDate = (value: string | null) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const formatDateOnly = (value: string | null) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
};

const Field = ({
    label,
    value,
    isMultiline,
}: {
    label: string;
    value: string | number | null | undefined;
    isMultiline?: boolean;
}) => {
    const hasValue = value !== null && value !== undefined && value !== "";
    return (
        <div className={isMultiline ? "space-y-1.5 sm:col-span-2" : "space-y-1.5"}>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
            </dt>
            <dd className="min-h-5 text-sm font-medium text-foreground">
                {isMultiline ? (
                    hasValue ? (
                        <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-muted p-3 text-xs">
                            {value}
                        </pre>
                    ) : (
                        <span className="italic text-muted-foreground">Not provided</span>
                    )
                ) : hasValue ? (
                    value
                ) : (
                    <span className="italic text-muted-foreground">Not provided</span>
                )}
            </dd>
        </div>
    );
};

const SectionCard = ({
    title,
    icon: Icon,
    children,
}: {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
}) => (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2 border-b pb-3">
            <Icon className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">{children}</dl>
    </div>
);

const MyProfile = () => {
    const { data, error, isError, refetch } = useGetMyProfileQuery();

    const user = data?.data.user;
    const profile = user?.profile;

    if (isError || !user || !profile) {
        return (
            <section
                role="alert"
                className="mx-auto w-full max-w-5xl rounded-2xl border bg-card p-6 shadow-sm sm:p-8"
            >
                <h2 className="text-lg font-semibold text-foreground">
                    Could not load your profile
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    {isError
                        ? getApiErrorMessage(error, "Please try loading your profile again.")
                        : "The profile response did not include the expected user details."}
                </p>
                <Button type="button" className="mt-5" onClick={() => void refetch()}>
                    <RefreshCw />
                    Try again
                </Button>
            </section>
        );
    }

    const accountStatus =
        user.is_active === null ? null : user.is_active ? "Active" : "Inactive";

    return (
        <section className="mx-auto w-full max-w-5xl space-y-6">
            {/* Header / Hero */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        {/* Avatar */}
                        {/* <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border bg-muted text-xl font-semibold text-muted-foreground shadow-sm">
                            {profile.avatar ? (
                                <img
                                    src={profile.avatar}
                                    alt={user.name ?? "Avatar"}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            ) : (
                                getInitials(user.name)
                            )}
                        </div> */}

                        {/* Name / Email / Status */}
                        <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                                    {user.name ?? "Unnamed User"}
                                </h2>
                                {accountStatus && (
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${accountStatus === "Active"
                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                            : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                                            }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${accountStatus === "Active"
                                                ? "bg-emerald-500"
                                                : "bg-rose-500"
                                                }`}
                                        />
                                        {accountStatus}
                                    </span>
                                )}
                            </div>
                            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Mail className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{user.email}</span>
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 gap-2">
                        <ChangePasswordDialog />
                    </div>
                </div>
            </div>

            {/* Account Info */}
            <SectionCard title="Account Information" icon={User}>
                <Field label="User ID" value={user.id} />
                <Field label="Name" value={user.name} />
                <Field label="Email" value={user.email} />
                <Field label="Email verified at" value={formatDate(user.email_verified_at)} />
            </SectionCard>

            {/* Contact Info */}
            <SectionCard title="Contact & Personal" icon={Phone}>
                <Field label="Phone" value={profile.phone} />
                <Field label="Date of birth" value={formatDateOnly(profile.date_of_birth)} />
                <Field label="Gender" value={profile.gender} />
                <Field label="Profile ID" value={profile.id} />
            </SectionCard>

            {/* Address */}
            <SectionCard title="Address" icon={MapPin}>
                <Field label="Address line 1" value={profile.address_line_1} />
                <Field label="Address line 2" value={profile.address_line_2} />
                <Field label="City" value={profile.city} />
                <Field label="State" value={profile.state} />
                <Field label="Postal code" value={profile.postal_code} />
                <Field label="Country" value={profile.country} />
            </SectionCard>

            {/* Metadata */}
            <SectionCard title="Additional Metadata" icon={Calendar}>
                <Field
                    label="Metadata"
                    value={profile.metadata ? JSON.stringify(profile.metadata, null, 2) : null}
                    isMultiline
                />
                <Field label="Profile created" value={formatDate(profile.created_at)} />
                <Field label="Profile updated" value={formatDate(profile.updated_at)} />
            </SectionCard>
        </section>
    );
};

export default MyProfile;