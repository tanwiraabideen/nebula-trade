import Image from "next/image";
import NavBar from "./components/NavBar";
import { Poppins } from "next/font/google";
import homeImage from "../../public/home-photo-2.png"
import Button from "./components/Button";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const poppins = Poppins({ subsets: ["latin"], weight: "300" })

export default async function Home() {
  // const { isLoggedIn } = await getAuth()
  const { isAuthenticated, getUser } = getKindeServerSession()
  const user = await getUser()
  const isLoggedIn = await isAuthenticated()

  if (isLoggedIn) {
    // redirect('/my-dash')
  }


  return (<div className="w-screen">
    <NavBar></NavBar>
    <div className="w-screen flex justify-center items-center flex-col mt-10">
      <h1 className="text-slate-50 font-bold text-6xl">Learn Crypto trading, risk-free.</h1>
      <p className={`${poppins.className} text-slate-400 my-4 font-light text-lg mb-4`}>Master the markets with real-time, zero-risk trading</p>
      <RegisterLink><Button text="Register"></Button></RegisterLink>
      <Image height="500" src={homeImage} className="mt-4"></Image>
    </div>


  </div>);

}
