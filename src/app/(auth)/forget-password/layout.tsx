import { Metadata } from "next";
import * as React from "react";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
