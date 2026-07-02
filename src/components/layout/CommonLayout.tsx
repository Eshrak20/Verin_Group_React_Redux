
import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";




interface IProps {
    children: ReactNode
    // children: ReactElement
}


export default function CommonLayout({ children }: IProps) {
    return (
        <div className="relative min-h-screen flex flex-col">
            <Navbar />
            <div className="grow pt-24">
                {children}
            </div>

            <Footer /> 
        </div>
    );
}