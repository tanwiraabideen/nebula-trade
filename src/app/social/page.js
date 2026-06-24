import { redirect } from "next/navigation";
import UserCreator from "../components/UserCreator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Balance from "../components/Balance";
import { getUserDataByEmail, getUserValue, getSocialUsers } from "../actions/actions";
import { createUser } from "../actions/actions";
import Value from "../components/UsdValue";
import SideBar from "../components/SideBar";
import Search from "../components/Search";
import SocialLeaderboard from "../components/SocialLeaderboard";

export default async function Social() {
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
        return <div className="text-white">Error: Unable to fetch user data</div>;
    }

    if (!user) {
        return <div className="text-white">User not found</div>;
    }

    const value = await getUserValue(user.id)
    const socialUsers = await getSocialUsers()

    return (
        <div className="grid grid-cols-[auto_1fr] gap-0">
            <div className="w-fit">
                <SideBar user={user} currentPage={"social"}></SideBar>
            </div>
            <div id="social" className="ml-32">
                <div id="top-row" className="flex items-center justify-between">
                    <Search></Search>
                    <div id="balances" className="flex flex-row gap-4 mt-6 mr-7">
                        <Balance email={user.email} name={user.name} balance={user.balanceUSD} myUser={myUser}></Balance>
                        <Value user={user} myUser={myUser}></Value>
                    </div>
                </div>
                <div className="mt-8 flex justify-center mr-7">
                    <SocialLeaderboard users={socialUsers} currentUserId={user.id} />
                </div>

                <UserCreator></UserCreator>
            </div>
        </div>
    );
}
