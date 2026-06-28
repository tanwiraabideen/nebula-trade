import { getTokenById } from "../../../actions/actions"
import CryptoChart from "../../../components/CryptoChart"
import Balance from "../../../components/Balance"
import Value from "../../../components/UsdValue"
import SearchBar from "../../../components/Search"
import SideBar from "../../../components/SideBar"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation"
import { createUser } from "../../../actions/actions"
import { getUserDataByEmail } from "../../../actions/actions"
import BuySell from "../../../components/BuySell"
import TokenBalance from "../../../components/TokenBalance"
import BalanceClient from "../../../components/BalanceClient"


export default async function tokenPage({ params }) {
    const { isAuthenticated, getUser } = getKindeServerSession();
    const isLoggedIn = await isAuthenticated();
    const kindeUser = await getUser()
    let user
    let myUser = false

    if (!isLoggedIn) {
        redirect('/')
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



    const id = params.id
    const coin = await getTokenById(id)

    if (!coin) {
        return 'No coin found'
    }

    return (
        <div className="flex min-h-screen">
            <SideBar user={user} currentPage="market" />

            <div className="flex-1 px-8 py-6 min-w-0">
                <div className="flex items-center justify-between mb-8">
                    <SearchBar />
                    <div className="flex gap-4">
                        <BalanceClient user={user} myUser={myUser} />
                        <Value user={user} myUser={myUser} />
                    </div>
                </div>

                <TokenBalance classes="mb-6 w-fit" tokenId={id} userId={user.id} />

                <div className="flex flex-col items-center gap-5 w-full">
                    <CryptoChart coin={coin} />
                    <BuySell tokenId={id} email={user.email} />
                </div>
            </div>
        </div>
    )
}