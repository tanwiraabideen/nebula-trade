import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Button from "../../components/Button";
import { redirect } from "next/navigation";
import UserCreator from "../../components/UserCreator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Balance from "../../components/Balance";
import { getUserDataById } from "../actions/actions";

export default async function Dashboard({ params }) {
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
        // Handle the error appropriately, e.g., show an error message or redirect
        return <div>Error: Unable to fetch user data</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div>
            <h1 className="text-slate-50">Welcome, {user.name}</h1>
            <Balance user={user}></Balance>
            <LogoutLink><Button text="Log out"></Button></LogoutLink>
            <UserCreator></UserCreator>
        </div>
    );
}