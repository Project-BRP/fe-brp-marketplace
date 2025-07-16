import { Metadata } from "next";
import * as React from "react";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignUpPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
