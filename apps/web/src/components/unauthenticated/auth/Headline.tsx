interface HeadlineProps {
  title: string;
  className?: string;
}
export const Headline = ({ title, className }: HeadlineProps) => {
  return <p className={`font-medium font-oswald text-steel-blue text-3xl ${className}`}>{title}</p>;
};
