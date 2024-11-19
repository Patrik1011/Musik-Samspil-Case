interface ButtonProps {
  title: string;
  type?: "button" | "submit" | "reset";
  className?: string;
}
export const Button = ({ title, type, className }: ButtonProps) => {
  return (
    <button
      className={`w-full lg:mx-0 text-base font-bold bg-steel-blue text-white mt-2 py-4 px-8 rounded-[10px] shadow-custom focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-200 ease-in-out ${className}`}
      type={type}
    >
      {title}
    </button>
  );
};
