import GroupIcon from '@mui/icons-material/Group';

export default function CompetitionPromo() {
    return (
        <div className="flex flex-col bg-gradient-to-br from-violet-900/60 to-purple-950/80 border border-violet-700/30 p-4 rounded-xl hover:border-violet-600/50 hover:shadow-lg hover:shadow-purple-900/30 transition-all duration-200 cursor-pointer">
            <div className="p-2 rounded-lg bg-violet-700/20 border border-violet-700/30 w-fit mb-3">
                <GroupIcon sx={{ color: '#a78bfa', fontSize: 20 }} />
            </div>
            <h1 className="text-white text-sm font-semibold">Competitions</h1>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">Compete with friends for even more fun!</p>
        </div>
    )
}