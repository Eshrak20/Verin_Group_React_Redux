
import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";




interface IProps {
    children: ReactNode
    // children: ReactElement
}


export default function CommonLayout({ children }: IProps) {
    return (
        <div className="relative min-h-screen flex flex-col bg-home">
            <div>
                <Navbar />
            </div>
            <div className="grow pt-22 max-w-6xl mx-auto w-full">
                {children}
            </div>

            <Footer /> 
        </div>
    );
}