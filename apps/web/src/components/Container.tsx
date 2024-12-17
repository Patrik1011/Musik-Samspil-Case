import clsx from "clsx";
import React from "react";

interface ContainerProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
}

export function Container({ className, ...props }: ContainerProps) {
  return <div className={clsx("mx-auto max-w-6xl px-4 lg:px-8", className)} {...props} />;
}
