
export default function ProgressBar({ lastIcon, children, classes, percentage }) {
    return (
        <div className={`p-2 rounded-xl bg-purple-900 flex items-center ${classes}`}>
            <div className="h-10 rounded-xl bg-purple-600 flex items-center justify-center" style={{ width: `${percentage}%` }}>
                {children}
            </div>
            <div className="size-fit p-2 bg-slate-800 opacity-85 flex items-center justify-center rounded-full ml-auto">
                {lastIcon}
            </div>


        </div>
    )
}