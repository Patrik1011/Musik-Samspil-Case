interface DividerProps {
  className?: string;
}

export const Divider = ({ className }: DividerProps) => {
  return <hr className={`border-t border-soft-gray ${className}`} />;
};
