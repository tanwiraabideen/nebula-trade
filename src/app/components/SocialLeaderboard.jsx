import Link from "next/link";
import Image from "next/image";
import placeholder from "../../../public/placeholder.jpeg";

const rankMedals = ["🥇", "🥈", "🥉"];

export default function SocialLeaderboard({ users, currentUserId }) {
    if (!users || users.length === 0) {
        return (
            <div className="bg-slate-900 rounded-2xl p-8 text-center">
                <p className="text-slate-400">No traders on the leaderboard yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-4xl mx-auto">
            <h1 className="text-white text-2xl font-bold mb-6">Global Leaderboard</h1>
            <div className="overflow-hidden rounded-lg">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-gray-400 text-sm bg-slate-800">
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
                                    className={`${
                                        isCurrentUser
                                            ? "bg-purple-900/40 border-l-4 border-purple-500"
                                            : index % 2 === 0
                                                ? "bg-slate-950"
                                                : "bg-slate-900"
                                    } hover:bg-slate-700/50 transition-colors`}
                                >
                                    <td className="px-4 py-4 text-white font-semibold">
                                        {rank <= 3 ? rankMedals[index] : rank}
                                    </td>
                                    <td className="px-4 py-4">
                                        <Link
                                            href={`/social/profiles/${socialUser.id}`}
                                            className="flex items-center gap-3 group"
                                        >
                                            <Image
                                                src={placeholder}
                                                width={36}
                                                height={36}
                                                className={`rounded-full ${isCurrentUser ? "border-2 border-purple-500" : "border border-slate-600"}`}
                                                alt={`${socialUser.name}'s avatar`}
                                            />
                                            <span className={`font-medium group-hover:underline ${isCurrentUser ? "text-purple-300" : "text-white"}`}>
                                                {socialUser.name}
                                                {isCurrentUser && (
                                                    <span className="ml-2 text-xs text-purple-400 font-normal">(You)</span>
                                                )}
                                            </span>
                                        </Link>
                                    </td>
                                    <td className="px-4 py-4 text-right text-slate-300">
                                        ${Number(socialUser.balanceUSD.toFixed(2))}
                                    </td>
                                    <td className={`px-4 py-4 text-right font-semibold ${isCurrentUser ? "text-purple-300" : "text-white"}`}>
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
