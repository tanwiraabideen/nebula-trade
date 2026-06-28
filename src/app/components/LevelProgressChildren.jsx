import Image from "next/image"

export default function LevelProgressChildren({ value, currentLevel, nextLevel }) {
    return (
        <div className="flex flex-row items-center w-full px-2">
            <Image src={currentLevel.icon} width={28} height={28} className="rounded-full" alt={currentLevel.name} />
            <span className="text-violet-200 text-xs font-semibold ml-auto">${value}<span className="text-white/60">/{nextLevel.valueRequired}</span></span>
        </div>
    )
}