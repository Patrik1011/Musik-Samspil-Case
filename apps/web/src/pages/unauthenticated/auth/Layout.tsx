import React from "react";
export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid place-items-center h-full">
      <div className="mt-6 mb-16 px-4 w-full max-w-xl mx-auto space-y-8">
        {children}
      </div>
    </div>
  );
};
