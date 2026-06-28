export default function Button({ type, text, styles }) {
    return (
        <button
            type={type}
            className={`${styles} relative text-white font-medium px-6 py-2.5 rounded-lg bg-gradient-to-r from-violet-700 to-purple-600 hover:from-violet-600 hover:to-purple-500 shadow-lg shadow-purple-900/40 hover:shadow-purple-700/50 transition-all duration-200 hover:scale-105`}
        >
            {text}
        </button>
    )
}