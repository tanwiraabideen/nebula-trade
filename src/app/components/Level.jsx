import Image from "next/image"
import { getLevel } from "../utils/utils"
import ProgressBar from "./ProgressBar"
import LevelProgressChildren from "./LevelProgressChildren"

export default function Level({ value, classes }) {
    const { currentLevel, nextLevel, percentage } = getLevel(value)

    return (
        <div>
            {currentLevel ?
                <div className={`bg-slate-900 w-fit p-5 flex flex-col rounded-2xl ${classes}`}>
                    <div className="flex flex-row items-center mb-4">
                        <Image src={currentLevel.icon} width={50} height={50}></Image>
                        <h1 className="font-bold text-slate-50 ml-4 text-2xl">{currentLevel.name}</h1>
                    </div>

                    <ProgressBar lastIcon={<Image src={nextLevel.icon} height={25} width={25}></Image>} children={<LevelProgressChildren value={Number(value.toFixed(2))} currentLevel={currentLevel} nextLevel={nextLevel}></LevelProgressChildren>} classes={`w-96`} percentage={percentage}></ProgressBar>
                </div>
                : <h1 className="text-white">Loading Level</h1>}
        </div>
    )
}