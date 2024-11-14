interface HeadlineProps {
  title: string;
  className?: string;
}

export const Headline = ({ title, className }: HeadlineProps) => {
  return (
    <p
      className={`text-white font-oswald uppercase font-medium text-xl md:text-[26px] leading-[39px] ${className}`}
    >
      {title}
    </p>
  );
};
