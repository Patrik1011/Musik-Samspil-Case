import React from "react";

interface SelectProps {
  label?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  errorMessages?: string;
}

export const Select = ({ label, onChange, options, errorMessages }: SelectProps) => {
  const [selectedOption, setSelectedOption] = React.useState<string>("");
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedOption(value);

    onChange(e);
  };
  return (
    <div className="mb-4">
      <label htmlFor="selectId" className="text-sm text-[14px] text-medium-gray">
        {label}
      </label>
      <select
        id="selectId"
        className="block w-full p-2 mt-1 py-3 border border-soft-gray bg-transparent text-base text-medium-gray rounded-[10px] outline-none custom-select"
        value={selectedOption}
        onChange={handleChange}
      >
        <option value="" disabled>
          Select an instrument
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errorMessages && <p className="text-red-400 text-[14px]">{errorMessages}</p>}
    </div>
  );
};
