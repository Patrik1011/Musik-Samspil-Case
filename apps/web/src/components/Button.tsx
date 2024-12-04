import React from "react";

interface ButtonProps {
  title: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
export const Button = ({ title, type, className, onClick }: ButtonProps) => {
  return (
    <div>
      <button
        className={`lg:mx-0 text-base font-bold py-4 px-8 rounded-[10px] shadow-custom  ${className}`}
        type={type}
        onClick={onClick}
      >
        {title}
      </button>
    </div>
  );
};
