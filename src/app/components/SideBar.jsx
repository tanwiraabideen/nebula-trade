import Link from "next/link"
import Image from "next/image"
import logo from '../../../public/logo.png'
import placeholder from '../../../public/placeholder.jpeg'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import GroupIcon from '@mui/icons-material/Group';
import StoreIcon from '@mui/icons-material/Store';
import LogoutIcon from '@mui/icons-material/Logout';
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import CompetitionPromo from "./CompetitionPromo";

const NavItem = ({ href, icon: Icon, label, isActive }) => (
    <Link href={href} className="w-full">
        <div className={`flex items-center cursor-pointer duration-200 px-4 py-4 relative mx-3 rounded-xl mb-1 ${
            isActive
                ? 'bg-purple-900/50 border border-purple-700/50 shadow-lg shadow-purple-900/30'
                : 'hover:bg-purple-900/20 border border-transparent'
        }`}>
            {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-b from-violet-500 to-purple-600 h-8 w-1 rounded-r-full" />}
            <Icon sx={{ color: isActive ? '#a78bfa' : '#94a3b8', fontSize: 24 }} className="ml-3" />
            <h1 className={`ml-4 font-medium text-sm ${isActive ? 'text-violet-200' : 'text-slate-400'}`}>{label}</h1>
        </div>
    </Link>
);

export default function SideBar({ user, currentPage }) {
    const navItems = [
        { id: 'dashboard', href: '/my-dash', icon: SpaceDashboardIcon, label: 'Dashboard' },
        { id: 'social', href: '/social', icon: GroupIcon, label: 'Social' },
        { id: 'market', href: '/market', icon: StoreIcon, label: 'Market' },
    ];

    return (
        <aside className="flex flex-col bg-[#07071c] border-r border-purple-900/30 w-72 h-screen sticky top-0">
            <Link href='/' className="flex items-center gap-2 px-5 py-4 border-b border-purple-900/30">
                <Image src={logo} height={52} alt="Nebula Trade Logo" />
                <h1 className="text-lg font-light tracking-wide text-purple-200">Nebula Trade</h1>
            </Link>

            <div className="flex items-center gap-3 px-5 py-4 mx-3 mt-4 mb-2 bg-[#0d0d2b] rounded-xl border border-purple-900/30">
                <div className="relative">
                    <Image src={placeholder} height={44} width={44} className="rounded-full ring-2 ring-purple-700/60" alt={`${user.name}'s profile`} />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#07071c]" />
                </div>
                <div className="min-w-0">
                    <h1 className="text-white font-semibold text-sm truncate">{user.name}</h1>
                    <p className="text-purple-400 text-xs">Active trader</p>
                </div>
            </div>

            <nav className="flex flex-col w-full mt-2 flex-1">
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

            <div className="mb-4 w-full flex flex-col gap-3 px-3">
                <CompetitionPromo />
                <LogoutLink className="w-full">
                    <div className="flex items-center cursor-pointer duration-200 px-4 py-3 rounded-xl hover:bg-red-900/20 border border-transparent hover:border-red-900/30 mx-0">
                        <LogoutIcon sx={{ color: '#f87171', fontSize: 20 }} className="ml-1" />
                        <h1 className="text-red-400 ml-3 font-medium text-sm">Logout</h1>
                    </div>
                </LogoutLink>
            </div>
        </aside>
    );
}