export default function Button({ type, text, styles }) {
    return (

        <button type={type} className={`${styles} text-white bg-gradient-to-t from-violet-600 to-fuchsia-500 p-2 rounded-md hover:scale-105 duration-150 hover:opacity-90`}>{text}</button>
    )
}