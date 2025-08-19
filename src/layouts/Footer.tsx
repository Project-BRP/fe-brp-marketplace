"use client";

import { Mail, MapPin, Phone } from "lucide-react";

import NextImage from "@/components/NextImage";
import { Skeleton } from "@/components/Skeleton";
import Typography from "@/components/Typography";
import { useGetCompanyInfo } from "./hooks/useCompanyInfo";

/**
 * Component for the site-wide footer.
 * It fetches company information using the useCompanyInfo hook and displays it.
 * Shows a skeleton loader while data is being fetched.
 * Renders null if there is an error or no data is returned.
 */
export default function Footer() {
  const { data: companyInfo, isLoading, isError } = useGetCompanyInfo();

  // Show a skeleton loader while the data is being fetched.
  if (isLoading) {
    return <FooterSkeleton />;
  }

  // According to the request, if data is available (even with a null logoUrl),
  // the footer should be displayed. If there's an error or no data object,
  // do not render the footer.
  if (isError || !companyInfo) {
    return null;
  }

  const { companyName, logoUrl, email, phoneNumber, fullAddress } = companyInfo;

  return (
    <footer className="bg-background border-t-2 border-border mt-12">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Section 1: Company Info & Logo */}
          <div className="md:col-span-5 lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              {logoUrl && (
                <div className="flex-shrink-0">
                  <NextImage
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${logoUrl}`}
                    alt={`${companyName} Logo`}
                    width={50}
                    height={50}
                    className="rounded-full"
                    imgClassName="w-full h-full object-cover rounded-full"
                  />
                </div>
              )}
              <Typography
                variant="h3"
                as="h2"
                className="font-semibold text-slate-800"
              >
                {companyName}
              </Typography>
            </div>
            <Typography variant="p" className="text-slate-800">
              © {new Date().getFullYear()} {companyName}. All Rights Reserved.
            </Typography>
          </div>

          {/* Spacer for layout */}
          <div className="hidden md:block md:col-span-2 lg:col-span-2" />

          {/* Section 2: Contact Information */}
          <div className="md:col-span-5 lg:col-span-5 space-y-4">
            <Typography
              variant="h4"
              as="h3"
              className="font-semibold text-slate-800"
            >
              Hubungi Kami
            </Typography>
            <address className="not-italic space-y-3">
              <div className="flex items-start gap-3">
                <MapPin
                  className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0 text-slate-800"
                  aria-hidden="true"
                />
                <Typography variant="p" className="text-slate-800">
                  {fullAddress}
                </Typography>
              </div>
              <div className="flex items-center gap-3">
                <Mail
                  className="w-5 h-5 text-primary-500 flex-shrink-0 text-slate-800"
                  aria-hidden="true"
                />
                <Typography
                  as="a"
                  href={`mailto:${email}`}
                  variant="p"
                  className="hover:text-slate-700 transition-colors text-slate-800"
                >
                  {email}
                </Typography>
              </div>
              <div className="flex items-center gap-3">
                <Phone
                  className="w-5 h-5 text-primary-500 flex-shrink-0 text-slate-800"
                  aria-hidden="true"
                />
                <Typography
                  as="a"
                  href={`tel:${phoneNumber}`}
                  variant="p"
                  className="hover:text-slate-700 transition-colors text-slate-800"
                >
                  {phoneNumber}
                </Typography>
              </div>
            </address>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * Skeleton component for the Footer.
 * Displays a loading state that mimics the footer's layout.
 */
const FooterSkeleton = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Skeleton for Company Info */}
          <div className="md:col-span-5 lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-[50px] h-[50px] rounded-md" />
              <Skeleton className="h-7 w-40" />
            </div>
            <Skeleton className="h-5 w-64" />
          </div>

          <div className="hidden md:block md:col-span-2 lg:col-span-4" />

          {/* Skeleton for Contact Info */}
          <div className="md:col-span-5 lg:col-span-4 space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Skeleton className="w-5 h-5 rounded-full mt-0.5" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="w-5 h-5 rounded-full" />
                <Skeleton className="h-4 w-44" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="w-5 h-5 rounded-full" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
