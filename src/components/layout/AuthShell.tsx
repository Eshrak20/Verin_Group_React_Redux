import type { ReactNode } from "react";

const AuthShell = ({ children }: { children: ReactNode }) => {
    return (
        <section className="flex min-h-140 items-center justify-center bg-secondary/30 px-5 py-10 sm:px-8 lg:min-h-svh lg:px-12 lg:py-12">
            <div className="flex w-full max-w-110 flex-col items-center gap-6">
                <div className="w-full rounded-3xl border border-white/80 bg-[#fffdfa] px-6 py-8 shadow-[0_24px_70px_rgba(43,36,32,0.10)] sm:px-9 sm:py-9">
                    {children}
                </div>

                <p className="text-center text-xs text-muted-foreground">
                    <p className="text-center text-xs text-muted-foreground">
                        © {new Date().getFullYear()} VERIN Group. All Rights Reserved.
                    </p>
                </p>
            </div>
        </section>
    );
};

export default AuthShell;