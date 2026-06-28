import { redirect } from "next/navigation";
import UserCreator from "../components/UserCreator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Balance from "../components/Balance";
import { getUserDataByEmail, getUserValue } from "../actions/actions";
import { createUser } from "../actions/actions";
import Value from "../components/UsdValue";
import SideBar from "../components/SideBar";
import Search from "../components/Search";
import LeaderboardServer from "../components/LeaderboardServer";
import Level from "../components/Level";
import TokenCard from "../components/TokenCard";
import UserTransaction from "../components/UserTransactions"

export default async function Dashboard() {
    const { isAuthenticated, getUser } = getKindeServerSession();
    const isLoggedIn = await isAuthenticated();
    const kindeUser = await getUser()
    let user
    let myUser = false

    if (!isLoggedIn) {
        redirect('/');
    }




    try {
        await createUser()
        user = await getUserDataByEmail(kindeUser.email);
        if (user && kindeUser.given_name === user.name) {
            myUser = true
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle the error appropriately, e.g., show an error message or redirect
        return <div className="text-white">Error: Unable to fetch user data</div>;
    }

    if (!user) {
        return <div className="text-white">User not found</div>;
    }

    const value = await getUserValue(user.id)

    return (
        <div className="flex min-h-screen">
            <SideBar user={user} currentPage={"dashboard"} />

            <div className="flex-1 flex flex-col min-w-0 px-8 py-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-slate-500 text-sm">Welcome back</p>
                        <h1 className="text-white font-bold text-2xl">{user.name}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <Search />
                        <Balance email={user.email} name={user.name} balance={user.balanceUSD} myUser={myUser} />
                        <Value user={user} myUser={myUser} />
                    </div>
                </div>

                <div className="flex flex-row items-start gap-6 mb-8">
                    <Level value={value} />
                    <LeaderboardServer email={user.email} />
                </div>

                <div className="mb-2">
                    <h2 className="text-slate-400 text-xs uppercase tracking-wider font-medium mb-4">Featured Markets</h2>
                    <div className="flex flex-row gap-5">
                        <TokenCard coinId="bitcoin" />
                        <TokenCard coinId="ethereum" />
                        <TokenCard coinId="solana" />
                    </div>
                </div>

                <div className="mt-6">
                    <UserTransaction email={user.email} />
                </div>

                <UserCreator />
            </div>
        </div>
    );
}