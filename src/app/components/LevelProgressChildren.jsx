import Image from "next/image"

export default function LevelProgressChildren({ value, currentLevel, nextLevel }) {
    return (
        <div className="flex flex-row items-center w-full">
            <Image src={currentLevel.icon} width={35} height={35} className={'rounded-full mr-auto ml-2'}></Image>
            <h1 className="text-yellow-500 ml-auto mr-4">${value}/${nextLevel.valueRequired}</h1>
        </div>
    )
}