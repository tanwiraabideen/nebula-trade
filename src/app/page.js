import Image from "next/image";
import NavBar from "./components/NavBar";
import homeImage from "../../public/home-photo-2.png"
import Button from "./components/Button";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Home() {
  const { isAuthenticated } = getKindeServerSession()
  const isLoggedIn = await isAuthenticated()

  if (isLoggedIn) {
    // redirect('/my-dash')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-24">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/30 border border-purple-700/40 text-purple-300 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
          Real-time market data — zero risk
        </div>

        <h1 className="text-center font-bold text-white leading-tight mb-6 max-w-3xl" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
          Learn crypto trading,{' '}
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            risk-free.
          </span>
        </h1>

        <p className="text-slate-400 text-lg mb-10 text-center max-w-xl leading-relaxed">
          Master the markets with a real-time paper trading simulator. Build skills without risking real money.
        </p>

        <div className="flex gap-4 mb-16">
          <RegisterLink>
            <Button text="Get Started Free" />
          </RegisterLink>
          <button className="px-6 py-2.5 rounded-lg border border-purple-700/50 text-purple-300 hover:bg-purple-900/20 transition-all duration-200 text-sm font-medium">
            Learn More
          </button>
        </div>

        <div className="relative w-full max-w-4xl">
          <div className="absolute inset-0 bg-purple-600/10 blur-3xl rounded-3xl scale-95"></div>
          <div className="relative rounded-2xl border border-purple-900/50 overflow-hidden shadow-2xl shadow-purple-900/30">
            <Image src={homeImage} alt="Platform preview" className="w-full h-auto" />
          </div>
        </div>
      </main>
    </div>
  );
}
