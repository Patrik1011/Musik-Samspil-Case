export interface NavLink {
  label: string;
  href: string;
  bgColor: string;
  spanColor: string;
}

export const Links: { authenticated: NavLink[]; unauthenticated: NavLink[] } = {
  authenticated: [
    {
      label: "Posts",
      href: "/posts",
      bgColor: "",
      spanColor: "text-steel-blue",
    },
    {
      label: "Ensembles",
      href: "/ensembles",
      bgColor: "",
      spanColor: "text-steel-blue",
    },
    {
      label: "Profile",
      href: "/profile",
      bgColor: "bg-steel-blue",
      spanColor: "text-white",
    },
    {
      label: "Logout",
      href: "#",
      bgColor: "bg-white",
      spanColor: "text-steel-blue",
    },
  ],
  unauthenticated: [
    {
      label: "Sign up",
      href: "/register",
      bgColor: "bg-steel-blue",
      spanColor: "text-white",
    },
    {
      label: "Sign in",
      href: "/login",
      bgColor: "bg-white",
      spanColor: "text-steel-blue",
    },
  ],
};
