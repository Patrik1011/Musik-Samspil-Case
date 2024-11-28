import React from "react";
import { Navigation } from "./components/navigation/Navigation";
import { Footer } from "./components/unauthenticated/footer/Footer";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow bg-indigo-100">{children}</main>
      <Footer />
    </div>
  );
};
