interface ContactButtonProps {
  href: string;
  content: string;
}

export const ContactButton = ({ href, content }: ContactButtonProps) => (
  <a
    href={href}
    className="block text-base text-center font-bold py-3 px-8 rounded-[10px] text-white bg-steel-blue"
  >
    {content}
  </a>
);
