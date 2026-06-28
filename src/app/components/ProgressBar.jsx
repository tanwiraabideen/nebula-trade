
export default function ProgressBar({ lastIcon, children, classes, percentage }) {
    return (
        <div className={`p-1.5 rounded-xl bg-[#12123a] border border-purple-900/40 flex items-center gap-2 ${classes}`}>
            <div className="flex-1 h-10 rounded-lg bg-[#0a0a22] relative overflow-hidden">
                <div
                    className="h-full rounded-lg bg-gradient-to-r from-violet-700 to-purple-500 flex items-center justify-center transition-all duration-500"
                    style={{ width: `${Math.max(percentage, 8)}%` }}
                >
                    {children}
                </div>
            </div>
            <div className="flex-shrink-0 p-1.5 bg-[#0d0d2b] border border-purple-900/40 flex items-center justify-center rounded-full">
                {lastIcon}
            </div>
        </div>
    )
}