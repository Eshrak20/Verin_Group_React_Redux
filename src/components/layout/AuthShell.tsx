import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

const AuthShell = ({ children }: { children: ReactNode }) => {
    return (
        <section className="flex min-h-140 items-center justify-center bg-secondary/30 px-5 py-10 sm:px-8 lg:min-h-svh lg:px-12 lg:py-12">
            <div className="flex w-full max-w-110 flex-col items-center gap-6">
                <div className="w-full rounded-3xl border border-white/80 bg-[#fffdfa] px-6 py-8 shadow-[0_24px_70px_rgba(43,36,32,0.10)] sm:px-9 sm:py-9">
                    <div className="mb-5">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
                        >
                            <ArrowLeft className="size-3.5" />
                            Back to Home
                        </Link>
                    </div>

                    {children}
                </div>

                <p className="text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} VERIN Group. All Rights Reserved.
                </p>
            </div>
        </section>
    );
};

export default AuthShell;