import type {FC, ButtonHTMLAttributes} from "react";

export const buttonClass = `
px-4 py-2
text-sm
rounded-lg
bg-[#43a047]
text-white
rounded-[5px]
uppercase
outline-none
transition-all
duration-300
ease-in-out
`;


type Props = ButtonHTMLAttributes<HTMLButtonElement>;

const Button: FC<Props> = ({ className = "", ...props }) => {
    return (
        <button
            {...props}
    className={`${buttonClass} ${className}`}
    />
);
};

export default Button;
