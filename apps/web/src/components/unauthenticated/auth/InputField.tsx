import React from "react";

interface InputFieldProps {
  label?: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessages?: string;
}

export const InputField = ({
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  errorMessages,
}: InputFieldProps) => {
  return (
    <div className="flex flex-col items-start w-full">
      {label && (
        <label className="text-sm text-[14px] text-medium-gray">{label}</label>
      )}
      <input
        className="w-full p-2 mt-1 text-base text-medium-gray border border-soft-gray rounded-xl"
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {errorMessages && (
        <p className="text-red-400 text-[14px]">{errorMessages}</p>
      )}
    </div>
  );
};
