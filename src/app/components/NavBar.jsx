import logo from "../../../public/logo.png"
import Link from "next/link"
import Image from "next/image"
import Button from "./Button"
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function NavBar() {
    return (
        <div className="w-full flex justify-between items-center text-slate-200 pt-2">
            <Link href='/' className="flex flex-row items-center">
                <Image src={logo} height={75} className="mb-2"></Image>
                <h1 className="text-2xl font-thin text-slate-400" >Nebula Trade</h1>
            </Link>
            <nav>
                <ul className="flex items-center space-x-10 mr-11">
                    <li>About</li>
                    <li>Contact Us</li>
                    <li>Docs</li>
                    <LoginLink><Button text="Login"></Button></LoginLink>
                </ul>
            </nav>
        </div>
    )
}