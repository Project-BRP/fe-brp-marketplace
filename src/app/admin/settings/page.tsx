"use client";

import { Building } from "lucide-react";
import { useState } from "react";

import { Skeleton } from "@/components/Skeleton";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import { useGetCompanyInfo } from "@/layouts/hooks/useCompanyInfo";
import CompanyInfoDisplay from "./_components/CompanyInfoDisplay";
import CompanyInfoForm from "./_components/CompanyInfoForm";
import NpwpSettings from "./_components/NPWPSettings";
import PpnSettings from "./_components/PpnSettings";

/**
 * The main settings page for company information and PPN.
 * It fetches company data and decides whether to show the display component,
 * the creation form, or the editing form, alongside the PPN settings.
 */
export default function SettingsPage() {
  const { data: companyInfo, isLoading, isError } = useGetCompanyInfo();
  // State to manage whether the create/edit form is visible.
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Show a loading skeleton while fetching data.
  if (isLoading) {
    return <SettingsPageSkeleton />;
  }

  const companyInfoSection = () => {
    // Handle case where company info doesn't exist yet.
    if ((isError || !companyInfo) && !isFormOpen) {
      return (
        <div className="text-center py-10 px-6 border-2 border-dashed rounded-lg col-span-1 lg:col-span-2">
          <Typography variant="h6" className="mb-2">
            Informasi Perusahaan Belum Dibuat
          </Typography>
          <Typography color="muted" className="mb-4">
            Silakan buat informasi perusahaan untuk ditampilkan di website Anda.
          </Typography>
          <Button onClick={() => setIsFormOpen(true)}>
            <Building className="w-4 h-4 mr-2" />
            Buat Informasi Perusahaan
          </Button>
        </div>
      );
    }

    // Show the creation/edit form if isFormOpen is true.
    if (isFormOpen) {
      return (
        <div className="col-span-1 lg:col-span-2">
          <CompanyInfoForm
            companyData={companyInfo}
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
      );
    }

    // Show the display component if data exists and not in form mode.
    if (companyInfo) {
      return (
        <div className="col-span-1 lg:col-span-2">
          <CompanyInfoDisplay
            companyData={companyInfo}
            onEditAddress={() => setIsFormOpen(true)}
          />
        </div>
      );
    }

    // Fallback to show the create form directly if no data.
    return (
      <div className="col-span-1 lg:col-span-2">
        <CompanyInfoForm />
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <Typography variant="h4">Pengaturan Perusahaan</Typography>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Render Company Info or Form */}
        {companyInfoSection()}

        {/* Render PPN Settings & NPWP Section only if not in company form mode */}
        {!isFormOpen && companyInfo && (
          <>
            <div className="lg:col-span-1">
              <PpnSettings />
            </div>

            {/* NPWP Section */}
            <div className="lg:col-span-1">
              <NpwpSettings />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Skeleton loader for the settings page.
 * Mimics the layout of the final page for a better user experience.
 */
const SettingsPageSkeleton = () => {
  return (
    <div className="p-6">
      <Skeleton className="h-8 w-1/3 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4 p-6 border rounded-lg col-span-1 lg:col-span-2">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
        </div>
        <div className="space-y-4 p-6 border rounded-lg">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      </div>
    </div>
  );
};
