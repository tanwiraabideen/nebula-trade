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
        <div className="flex min-h-screen">
            <SideBar user={user} currentPage="social" />

            <div className="flex-1 px-8 py-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-slate-500 text-sm">Community</p>
                        <h1 className="text-white font-bold text-2xl">Social</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <Search />
                        <Balance email={user.email} name={user.name} balance={user.balanceUSD} myUser={myUser} />
                        <Value user={user} myUser={myUser} />
                    </div>
                </div>

                <div className="flex justify-center">
                    <SocialLeaderboard users={socialUsers} currentUserId={user.id} />
                </div>

                <UserCreator />
            </div>
        </div>
    );
}
