import type {FC, InputHTMLAttributes} from "react";
import { baseFieldClass } from "./styles.ts";

type Props = InputHTMLAttributes<HTMLInputElement>;

const Input: FC<Props> = ({ className = "", ...props }) => {
    return (
        <input
            {...props}
    className={`${baseFieldClass} ${className}`}
    />
);
};

export default Input;
