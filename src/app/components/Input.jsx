import { Input } from "../../../@/components/ui/input"

export default function InputDemo({ className, placeholder, onChange }) {
    return <Input onChange={onChange} type="number" className={className} placeholder={placeholder} />
}
