import { useAppSelector } from "@/redux/hooks";

const DashboardHome = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium text-primary">Account overview</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          {user?.name ? `Welcome, ${user.name}` : "Welcome to your dashboard"}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Manage your account details and keep your profile information up to
          date.
        </p>
      </div>
    </section>
  );
};

export default DashboardHome;
