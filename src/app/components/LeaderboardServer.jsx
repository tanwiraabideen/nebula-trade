import Leaderboard from "./Leaderboard"
import { getUserDataByEmail } from "../actions/actions"

export default async function LeaderboardServer({ email }) {
    const user = await getUserDataByEmail(email)

    return (
        <Leaderboard user={user}></Leaderboard>
    )
}