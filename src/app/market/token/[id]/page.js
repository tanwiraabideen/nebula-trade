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
        <div className="relative z-0">
            <div className="grid grid-cols-[auto_1fr] gap-0">
                <div className="w-fit">
                    <SideBar user={user} currentPage={"market"}></SideBar>
                </div>
                <div id="token-page" className="ml-10 w-full"> {/* Added w-full here */}
                    <div id="top-row" className="flex items-center justify-between">
                        <SearchBar></SearchBar>
                        <div id="balances" className="flex flex-row gap-4 mt-6 mr-20">
                            <BalanceClient user={user} myUser={myUser}></BalanceClient>
                            <Value user={user} myUser={myUser}></Value>
                        </div>
                    </div>
                    <div id="bottom-row" className="flex flex-col mt-10 w-full"> {/* Removed items-center and justify-center */}
                        <TokenBalance classes={'mr-auto'} tokenId={id} userId={user.id}></TokenBalance> {/* Changed mr-auto to w-full */}
                        <div className="flex flex-col items-center w-full"> {/* New container for centered items */}
                            <CryptoChart coin={coin}></CryptoChart>
                            <BuySell tokenId={id} email={user.email}></BuySell>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}