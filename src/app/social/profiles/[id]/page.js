import { redirect } from "next/navigation";
import UserCreator from "../../../components/UserCreator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getUserDataById } from "../../../actions/actions";
import Image from "next/image";
import placeholder from "../../../../../public/placeholder.jpeg";
import Link from "next/link";

export default async function UserProfile({ params }) {
    const { isAuthenticated } = getKindeServerSession();
    const isLoggedIn = await isAuthenticated();

    if (!isLoggedIn) {
        redirect('/');
    }

    const id = params.id;
    let user;

    try {
        user = await getUserDataById(id);
    } catch (error) {
        console.error("Error fetching user data:", error);
        return <div className="text-white p-8">Error: Unable to fetch user data</div>;
    }

    if (!user) {
        return <div className="text-white p-8">User not found</div>;
    }

    return (
        <div className="min-h-screen px-8 py-10 max-w-3xl mx-auto">
            <Link href="/social" className="inline-flex items-center gap-2 text-slate-500 hover:text-purple-300 text-sm mb-8 transition-colors">
                ← Back to Leaderboard
            </Link>

            <div className="bg-[#0d0d2b] border border-purple-900/40 rounded-2xl p-8 shadow-xl mb-6">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <Image
                            src={placeholder}
                            width={80}
                            height={80}
                            className="rounded-full ring-2 ring-violet-600/60"
                            alt={`${user.name}'s profile`}
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0d0d2b]" />
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-3xl">{user.name}</h1>
                        <p className="text-purple-400 text-sm mt-1">Trader</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="bg-[#12123a] border border-purple-900/30 rounded-xl p-4">
                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">USD Balance</p>
                        <h2 className="text-white font-bold text-2xl">${Number(user.balanceUSD).toFixed(2)}</h2>
                    </div>
                    <div className="bg-[#12123a] border border-purple-900/30 rounded-xl p-4">
                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Account Status</p>
                        <h2 className="text-emerald-400 font-semibold text-lg">Active</h2>
                    </div>
                </div>
            </div>

            <UserCreator />
        </div>
    );
}