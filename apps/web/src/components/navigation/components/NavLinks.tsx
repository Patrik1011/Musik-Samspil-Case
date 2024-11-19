import { Links } from "../../../utils/nav-links";
import { Link } from "react-router-dom";
import { Popover, PopoverBackdrop, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ChevronUpIcon } from "./ChevronUp";
import { MenuIcon } from "./MenuIcon";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store.ts";
import { logoutUser } from "../../../redux/authActions.ts";

interface Props {
  isMobile: boolean;
}

export const NavLinks = ({ isMobile }: Props) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const renderLinks = () => {
    const links = isAuthenticated ? Links.authenticated : Links.unauthenticated;
    return links.map(({ label, href, bgColor, spanColor }) => {
      if (label === "Logout") {
        return (
          <button
            key={label}
            type="button"
            className={`relative rounded-xl px-7 py-4 text-sm border border-gray-500 ${bgColor ? bgColor : ""}`}
            onClick={handleLogout}
          >
            <span className={`text-base ${spanColor ? spanColor : ""}`}>{label}</span>
          </button>
        );
      }
      return (
        <Link
          key={label}
          className={`relative rounded-xl px-7 py-4 text-sm border border-gray-500 ${bgColor ? bgColor : ""}`}
          to={href}
        >
          <span className={`text-base ${spanColor ? spanColor : ""}`}>{label}</span>
        </Link>
      );
    });
  };

  if (isMobile) {
    return (
      <Popover className="lg:hidden">
        {({ open }) => (
          <>
            <PopoverButton
              aria-label="Toggle site navigation"
              className="relative z-10 -m-2 inline-flex items-center rounded-lg stroke-gray-900 p-2 hover:bg-gray-200/50 hover:stroke-gray-600 active:stroke-gray-900 ui-not-focus-visible:outline-none focus:outline-none"
            >
              {({ open }) =>
                open ? <ChevronUpIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />
              }
            </PopoverButton>
            <AnimatePresence initial={false}>
              {open && (
                <>
                  <PopoverBackdrop
                    static
                    animate={{ opacity: 1 }}
                    as={motion.div}
                    className="fixed inset-0  bg-gray-300/60 backdrop-blur"
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                  />
                  <PopoverPanel
                    static
                    animate={{ opacity: 1, y: 0 }}
                    as={motion.div}
                    className="absolute inset-x-0 top-0 bg-white px-6 pb-6 pt-32 shadow-2xl shadow-gray-900/20"
                    exit={{
                      opacity: 0,
                      y: -32,
                      transition: { duration: 0.2 },
                    }}
                    initial={{ opacity: 0, y: -32 }}
                  >
                    <div className="space-y-4">{renderLinks()}</div>
                  </PopoverPanel>
                </>
              )}
            </AnimatePresence>
          </>
        )}
      </Popover>
    );
  }

  return <>{renderLinks()}</>;
};
