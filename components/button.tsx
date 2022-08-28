import { ReactNode } from 'react'

type Props = {
    children: ReactNode
    className?: string
    onClick?: () => void
}

const Button = ({ className, children, onClick }: Props) => (
    <button type='button' className={className} onClick={onClick}>
        {children}
    </button>
)

export default Button
