import Image from "next/image"
import { getLevel } from "../utils/utils"
import ProgressBar from "./ProgressBar"
import LevelProgressChildren from "./LevelProgressChildren"

export default function Level({ value, classes }) {
    const { currentLevel, nextLevel, percentage } = getLevel(value)

    return (
        <div>
            {currentLevel ?
                <div className={`bg-[#0d0d2b] border border-purple-900/40 w-fit p-5 flex flex-col rounded-2xl shadow-lg ${classes}`}>
                    <p className="text-slate-500 text-xs uppercase tracking-widest mb-3">Your Level</p>
                    <div className="flex flex-row items-center mb-4">
                        <div className="p-2 rounded-xl bg-[#12123a] border border-purple-900/30">
                            <Image src={currentLevel.icon} width={42} height={42} alt={currentLevel.name} />
                        </div>
                        <h1 className="font-bold text-white ml-3 text-xl">{currentLevel.name}</h1>
                    </div>
                    <ProgressBar
                        lastIcon={<Image src={nextLevel.icon} height={22} width={22} alt={nextLevel.name} />}
                        children={<LevelProgressChildren value={Number(value.toFixed(2))} currentLevel={currentLevel} nextLevel={nextLevel} />}
                        classes="w-96"
                        percentage={percentage}
                    />
                </div>
                : <h1 className="text-slate-400 text-sm">Loading Level...</h1>}
        </div>
    )
}