interface SubHeadlineProps {
  title: string;
  className?: string;
}

export const SubHeadline = ({ title, className }: SubHeadlineProps) => {
  return <h2 className={`text-base font-bold ${className}`}>{title}</h2>;
};
