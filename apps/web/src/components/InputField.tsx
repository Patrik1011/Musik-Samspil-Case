import React from "react";

interface InputFieldProps {
  id: string;
  label?: string;
  name?: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessages?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const InputField = ({
  id,
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  errorMessages,
  required,
  disabled,
  className,
}: InputFieldProps) => {
  return (
    <div className="flex flex-col items-start w-full">
      {label && (
        <label htmlFor={id} className="text-sm text-[14px] text-medium-gray">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full p-2 mt-1 text-base text-medium-gray border border-soft-gray rounded-xl outline-none ${className}`}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
      />
      {errorMessages && <p className="text-red-400 text-[14px]">{errorMessages}</p>}
    </div>
  );
};
