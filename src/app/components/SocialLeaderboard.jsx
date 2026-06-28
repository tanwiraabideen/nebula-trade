import Link from "next/link";
import Image from "next/image";
import placeholder from "../../../public/placeholder.jpeg";

const rankMedals = ["🥇", "🥈", "🥉"];

export default function SocialLeaderboard({ users, currentUserId }) {
    if (!users || users.length === 0) {
        return (
            <div className="bg-[#0d0d2b] border border-purple-900/40 rounded-2xl p-8 text-center">
                <p className="text-slate-500">No traders on the leaderboard yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-[#0d0d2b] border border-purple-900/40 rounded-2xl p-6 w-full max-w-4xl mx-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-white text-xl font-bold">Global Leaderboard</h1>
                    <p className="text-slate-500 text-xs mt-0.5">{users.length} traders ranked</p>
                </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-purple-900/30">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[#0a0a22] text-slate-500 text-xs uppercase tracking-wider">
                            <th className="px-4 py-3 w-16">Rank</th>
                            <th className="px-4 py-3">Trader</th>
                            <th className="px-4 py-3 text-right">USD Balance</th>
                            <th className="px-4 py-3 text-right">Portfolio Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((socialUser, index) => {
                            const isCurrentUser = socialUser.id === currentUserId;
                            const rank = index + 1;

                            return (
                                <tr
                                    key={socialUser.id}
                                    className={`border-t border-purple-900/20 transition-colors duration-150 ${
                                        isCurrentUser
                                            ? "bg-purple-900/20 border-l-2 border-l-violet-500"
                                            : "hover:bg-purple-900/10"
                                    }`}
                                >
                                    <td className="px-4 py-3.5 text-sm">
                                        {rank <= 3
                                            ? <span className="text-base">{rankMedals[index]}</span>
                                            : <span className="text-slate-500 font-mono">#{rank}</span>
                                        }
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <Link href={`/social/profiles/${socialUser.id}`} className="flex items-center gap-3 group">
                                            <Image
                                                src={placeholder}
                                                width={32}
                                                height={32}
                                                className={`rounded-full ${isCurrentUser ? "ring-2 ring-violet-500" : "ring-1 ring-purple-900/50"}`}
                                                alt={`${socialUser.name}'s avatar`}
                                            />
                                            <span className={`text-sm font-medium group-hover:text-violet-300 transition-colors ${isCurrentUser ? "text-violet-300" : "text-white"}`}>
                                                {socialUser.name}
                                                {isCurrentUser && <span className="ml-2 text-xs text-violet-500 font-normal">(You)</span>}
                                            </span>
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3.5 text-right text-sm text-slate-400">
                                        ${Number(socialUser.balanceUSD.toFixed(2))}
                                    </td>
                                    <td className={`px-4 py-3.5 text-right text-sm font-semibold ${isCurrentUser ? "text-violet-300" : "text-white"}`}>
                                        ${Number(socialUser.userValue.toFixed(2))}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
