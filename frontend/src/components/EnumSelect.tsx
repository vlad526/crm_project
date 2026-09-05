import {baseFieldClass} from "./ui/styles.ts";

type EnumSelectProps<T extends string> = {
    id?: string;
    value?: T;
    onChange: (value: T | undefined) => void;
    options: readonly T[];
    placeholder?: string;
    className?: string;
};

export const EnumSelect = <T extends string>({ className = "",
                                                 value,
                                                 onChange,
                                                 options,
                                                 placeholder = "Select value",
                                             }: EnumSelectProps<T>) => {
    return (
        <select
            className={`${baseFieldClass} ${className}`}
            value={value ?? ""}
            onChange={(e) =>
                onChange(
                    e.target.value === ""
                        ? undefined
                        : (e.target.value as T)
                )
            }
        >
            <option value="">{placeholder}</option>
            {options.map(option => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
};
