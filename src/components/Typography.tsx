import * as React from "react";

import clsxm from "@/lib/clsxm";

export enum TypographyVariant {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
}

enum FontVariant {
  Inter,
}

enum FontWeight {
  thin,
  extralight,
  light,
  regular,
  medium,
  semibold,
  bold,
  extrabold,
  black,
}

type TypographyProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  weight?: keyof typeof FontWeight;
  font?: keyof typeof FontVariant;
  variant?: keyof typeof TypographyVariant;
  children: React.ReactNode;
};

export default function Typography<T extends React.ElementType>({
  as,
  children,
  weight = "regular",
  className,
  font = "Inter",
  variant = "p",
  ...props
}: TypographyProps<T> &
  Omit<React.ComponentProps<T>, keyof TypographyProps<T>>) {
  const Component = as || "p";
  return (
    <Component
      className={clsxm(
        // *=============== Font Type ==================
        "text-black",
        [
          font === "Inter" && [
            "font-inter",
            [
              weight === "regular" && "font-normal",
              weight === "medium" && "font-medium",
              weight === "bold" && "font-bold",
            ],
          ],
        ],
        // *=============== Font Variants ==================
        [
          variant === "h1" && ["text-3xl sm:text-4xl lg:text-5xl"],
          variant === "h2" && ["text-2xl sm:text-3xl lg:text-4xl"],
          variant === "h3" && ["text-xl sm:text-2xl lg:text-3xl"],
          variant === "h4" && ["text-lg sm:text-xl lg:text-2xl"],
          variant === "h5" && ["text-base sm:text-lg lg:text-xl"],
          variant === "h6" && ["text-sm sm:text-base lg:text-lg"],
          variant === "p" && ["text-xs sm:text-sm lg:text-base"],
        ],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
