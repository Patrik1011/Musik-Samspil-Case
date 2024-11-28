interface HeadlineProps {
  title: string;
  textColor: string;
  className?: string;
}

export const Headline = ({ title, className, textColor }: HeadlineProps) => {
  return (
    <p
      className={`font-oswald font-medium text-xl md:text-[26px] leading-[39px] ${className} ${textColor}`}
    >
      {title}
    </p>
  );
};
