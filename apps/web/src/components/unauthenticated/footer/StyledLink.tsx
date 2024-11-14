interface StyledLinkProps {
  label: string;
  href: string;
}

export const StyledLink = ({ label, href }: StyledLinkProps) => {
  return (
    <a className="text-white text-base font-bold" href={href}>
      {label}
    </a>
  );
};
