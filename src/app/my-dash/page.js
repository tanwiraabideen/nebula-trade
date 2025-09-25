import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Button from "../components/Button";
import { redirect } from "next/navigation";
import UserCreator from "../components/UserCreator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Balance from "../components/Balance";
import { getUserDataByEmail, getUserValue } from "../actions/actions";
import { createUser } from "../actions/actions";
import Value from "../components/UsdValue";
import SideBar from "../components/SideBar";
import Search from "../components/Search";
import Leaderboard from "../components/Leaderboard";
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
        createUser(kindeUser.email)
        user = await getUserDataByEmail(kindeUser.email);
        if (kindeUser.given_name === user.name) {
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
        <div className="grid grid-cols-[auto_1fr] gap-0">
            <div className="w-fit">
                <SideBar user={user} currentPage={"dashboard"}></SideBar>
            </div>
            <div id="dash" className="ml-32">
                <div id="top-row" className="flex items-center justify-between">
                    <Search></Search>
                    <div id="balances" className="flex flex-row gap-4 mt-6 mr-7">
                        <Balance email={user.email} name={user.name} balance={user.balanceUSD} myUser={myUser}></Balance>
                        <Value user={user} myUser={myUser}></Value>
                    </div>
                </div>
                <div id="leaderboard&level" className="flex flex-row items-center justify-between">
                    <LeaderboardServer email={user.email}></LeaderboardServer>
                    <Level classes={'mr-10'} value={value}></Level>
                </div>
                <div id="token cards" className="mt-5 flex flex-row space-x-7 justify-center">
                    <TokenCard coinId={'bitcoin'}></TokenCard>
                    <TokenCard coinId={'ethereum'}></TokenCard>
                    <TokenCard coinId={'solana'}></TokenCard>
                </div>
                <div className="flex justify-center">
                    <UserTransaction email={user.email}></UserTransaction>
                </div>

                <LogoutLink><Button text={"logout"}></Button></LogoutLink>
                <UserCreator></UserCreator>
            </div>
        </div>
    );
}