import type {FC, SelectHTMLAttributes} from "react";
import { baseFieldClass } from "./styles.ts";

type Props = SelectHTMLAttributes<HTMLSelectElement>;

const Select: FC<Props> = ({ className = "", children, ...props }) => {
    return (
        <select
            {...props}
    className={`${baseFieldClass} ${className}`}
>
    {children}
    </select>
);
};

export default Select;
