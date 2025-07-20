import Footer from "@/layouts/Footer";
import { LayoutProps } from "@/types/layout";

export default function Layout({ children, withFooter }: LayoutProps) {
  return (
    <>
      {children}
      {withFooter && <Footer />}
    </>
  );
}
