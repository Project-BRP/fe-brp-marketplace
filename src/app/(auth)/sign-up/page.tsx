"use client";
import NextImage from "@/components/NextImage";
import Layout from "@/layouts/Layout";
import LoginWithEmail from "./container/LoginWithEmail";
import { Toaster } from "react-hot-toast";

export default function SignUpPage() {
  return (
    <Layout withFooter={false} withNavbar={false}>
      <main className="relative bg-none w-full m-0 flex min-h-screen items-center justify-center gap-4 p-2 lg:flex-row lg:px-8 lg:py-12">
        <LoginWithEmail />
        <section className="w-full h-full -z-[100] absolute top-0 bottom-0 right-0 min-h-screen overflow-hidden">
          <NextImage
            src="/auth/backgroundDesktop.jpg"
            width={1440}
            height={1024}
            className="hidden sm:block md:w-[130%] sm:w-[115%] -z-[100] absolute top-0 bottom-0 right-0"
            imgClassName="object-cover w-full h-full"
            alt="Background image for desktop"
          />
          <NextImage
            src="/auth/backgroundDesktop.jpg"
            width={390}
            height={840}
            className="block sm:hidden w-[100%] -z-[100] absolute top-0 bottom-0 left-0"
            imgClassName="object-cover w-full h-full"
            alt="Background image for desktop"
          />
        </section>
      </main>
    </Layout>
  );
}
