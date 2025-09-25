import Link from "next/link"
import Image from "next/image"
import logo from '../../../public/logo.png'
import placeholder from '../../../public/placeholder.jpeg'
import { grey } from '@mui/material/colors';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import GroupIcon from '@mui/icons-material/Group';
import StoreIcon from '@mui/icons-material/Store';
import SettingsIcon from '@mui/icons-material/Settings';
import CompetitionPromo from "./CompetitionPromo";

const NavItem = ({ href, icon: Icon, label, isActive }) => (
    <Link href={href} className="w-full">
        <div className="flex items-center hover:bg-slate-950 cursor-pointer duration-200 p-2 py-6 relative">
            {isActive && <div className="absolute left-0 bg-purple-600 h-10 w-1" />}
            <Icon sx={{ color: grey[50] }} fontSize="large" className="ml-5" />
            <h1 className="text-white ml-16 font-bold">{label}</h1>
        </div>
    </Link>
);

export default function SideBar({ user, currentPage }) {
    const navItems = [
        { id: 'dashboard', href: '/my-dash', icon: SpaceDashboardIcon, label: 'Dashboard' },
        { id: 'social', href: '/social', icon: GroupIcon, label: 'Social' },
        { id: 'market', href: '/market', icon: StoreIcon, label: 'Market' },
        { id: 'settings', href: '/settings', icon: SettingsIcon, label: 'Settings' },
    ];

    return (
        <aside className="flex flex-col bg-slate-900 w-80 h-screen rounded-r-2xl">
            <Link href='/' className="flex items-center justify-center mt-2 mb-4">
                <Image src={logo} height={75} alt="Nebula Trade Logo" />
                <h1 className="text-2xl font-thin text-slate-400">Nebula Trade</h1>
            </Link>

            <div className="flex items-center flex-col mb-6">
                <Image src={placeholder} height={100} className="rounded-full" alt={`${user.name}'s profile`} />
                <h1 className="text-slate-200 mt-3 mb-2 font-semibold">{user.name}</h1>
                <p className="text-slate-400">A great trader</p>
            </div>

            <nav className="flex flex-col w-full">
                {navItems.map((item) => (
                    <NavItem
                        key={item.id}
                        href={item.href}
                        icon={item.icon}
                        label={item.label}
                        isActive={currentPage === item.id}
                    />
                ))}
            </nav>

            <div className="mt-auto mb-4 w-full flex justify-center">
                <CompetitionPromo />
            </div>
        </aside>
    );
}