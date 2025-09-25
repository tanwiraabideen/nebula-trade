import GroupIcon from '@mui/icons-material/Group';
import { grey } from '@mui/material/colors';
import { Rubik } from 'next/font/google';

const rubik = Rubik({ subsets: ["latin"] })

export default function CompetitionPromo() {
    return (
        <div className={`${rubik.className} flex flex-col bg-gradient-to-tl from-slate-900 to-purple-500 p-3 w-48 rounded-md mt-3 hover:scale-105 duration-200 cursor-pointer`}>
            <GroupIcon fontSize='large' sx={{ color: grey[50] }}></GroupIcon>
            <h1 className='text-white'>Create competitions</h1>
            <p className='text-gray-400 text-xs mt-2'>Compete with friends for even more fun!</p>
        </div>
    )
}