import logo from "../../../public/logo.png"
import Link from "next/link"
import Image from "next/image"
import Button from "./Button"
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function NavBar() {
    return (
        <div className="w-full flex justify-between items-center px-6 py-3 bg-black/20 backdrop-blur-md border-b border-purple-900/30 sticky top-0 z-50">
            <Link href='/' className="flex flex-row items-center gap-1 group">
                <Image src={logo} height={60} alt="Nebula Trade" className="mb-1" />
                <h1 className="text-xl font-light tracking-wide text-purple-200 group-hover:text-white transition-colors duration-200">
                    Nebula Trade
                </h1>
            </Link>
            <nav>
                <ul className="flex items-center gap-8 mr-4">
                    <li>
                        <span className="text-slate-400 hover:text-purple-300 cursor-pointer text-sm transition-colors duration-200">About</span>
                    </li>
                    <li>
                        <span className="text-slate-400 hover:text-purple-300 cursor-pointer text-sm transition-colors duration-200">Contact Us</span>
                    </li>
                    <li>
                        <span className="text-slate-400 hover:text-purple-300 cursor-pointer text-sm transition-colors duration-200">Docs</span>
                    </li>
                    <li>
                        <LoginLink><Button text="Login" /></LoginLink>
                    </li>
                </ul>
            </nav>
        </div>
    )
}