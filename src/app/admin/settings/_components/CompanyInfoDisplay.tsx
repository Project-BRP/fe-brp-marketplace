"use client";
import {
  Building,
  Check,
  Edit,
  Mail,
  MapPin,
  Phone,
  Upload,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useUpdateCompanyInfo } from "@/app/admin/settings/hooks/useMutateCompany";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import IconButton from "@/components/buttons/IconButton";
import Input from "@/components/form/Input";
import { CompanyInfo } from "@/types/companyInfo";
import { useGetCompanyProfile } from "../hooks/useCompanyProfile";
import LogoUploadModal from "./LogoUploadModal";

type EditableField = "companyName" | "email" | "phoneNumber";

/**
 * Component to display company information with inline editing capabilities.
 * Allows users to edit individual fields one at a time.
 */
export default function CompanyInfoDisplay({
  companyData,
  onEditAddress,
}: {
  companyData: CompanyInfo;
  onEditAddress: () => void;
}) {
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const { data: logoData } = useGetCompanyProfile();
  // Initialize useForm at the top level of the component.
  const methods = useForm<{ value: string }>();
  const { handleSubmit, reset } = methods;

  const { mutate: updateCompanyInfo, isPending } = useUpdateCompanyInfo();

  const handleEdit = (field: EditableField, currentValue: string) => {
    setEditingField(field);
    reset({ value: currentValue });
  };

  const handleCancel = () => {
    setEditingField(null);
    reset({ value: "" });
  };

  const onSubmit = (data: { value: string }) => {
    if (!editingField) return;

    const payload = { [editingField]: data.value };
    updateCompanyInfo(payload, {
      onSuccess: () => {
        handleCancel();
      },
    });
  };

  const renderField = (
    field: EditableField,
    label: string,
    value: string,
    Icon: React.ElementType,
  ) => {
    const isEditing = editingField === field;

    return (
      <div className="flex items-center justify-between py-3 border-b last:border-b-0">
        <div className="flex items-center gap-4">
          <Icon className="w-5 h-5 text-gray-500" />
          <div>
            <Typography variant="p" color="muted">
              {label}
            </Typography>
            {!isEditing ? (
              <Typography variant="p" className="font-medium">
                {value}
              </Typography>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex items-center gap-2 mt-1"
              >
                <Input
                  id="value"
                  validation={{ required: true }}
                  className="h-9"
                  autoFocus
                />
                <IconButton
                  type="submit"
                  icon={Check}
                  variant="ghost"
                  className="text-green-500 hover:bg-green-100"
                  disabled={isPending}
                />
                <IconButton
                  type="button"
                  icon={X}
                  variant="ghost"
                  className="text-red-500 hover:bg-red-100"
                  onClick={handleCancel}
                  disabled={isPending}
                />
              </form>
            )}
          </div>
        </div>
        {!isEditing && (
          <IconButton
            icon={Edit}
            variant="ghost"
            onClick={() => handleEdit(field, value)}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <FormProvider {...methods}>
        <div className="space-y-6">
          <Card className="border-border shadow-card">
            <CardHeader>
              <CardTitle
                className={`flex ${
                  logoData?.imageUrl
                    ? "flex-col items-start justify-center"
                    : "flex-row justify-between"
                }`}
              >
                {logoData?.imageUrl && (
                  <div className="w-full flex justify-center items-center ">
                    <NextImage
                      onClick={() => setIsLogoModalOpen(true)}
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${logoData?.imageUrl}`}
                      alt="Company Logo"
                      width={200}
                      height={200}
                      className="rounded-full hover:border-8 hover:border-green-600 hover:cursor-pointer"
                      imgClassName="object-cover w-full h-full rounded-full "
                    />
                  </div>
                )}
                <div className="flex items-center">
                  <Building className="h-5 w-5 mr-2 text-primary" />
                  <Typography variant="h6" className="font-bold">
                    Informasi Perusahaan
                  </Typography>
                </div>
                {!logoData?.imageUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsLogoModalOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Unggah Logo
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderField(
                "companyName",
                "Nama Perusahaan",
                companyData.companyName,
                Building,
              )}
              {renderField("email", "Email", companyData.email, Mail)}
              {renderField(
                "phoneNumber",
                "Nomor Telepon",
                companyData.phoneNumber,
                Phone,
              )}
            </CardContent>
          </Card>

          <Card className="border-border shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                <Typography variant="h6" className="font-bold">
                  Alamat Perusahaan
                </Typography>
              </CardTitle>
              <Button variant="outline" size="sm" onClick={onEditAddress}>
                <Edit className="w-4 h-4 mr-2" />
                Ubah Alamat
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Typography variant="p" className="font-medium">
                  {companyData.fullAddress}
                </Typography>
                <Typography variant="p" color="muted">
                  {companyData.subDistrict}, {companyData.district},{" "}
                  {companyData.city}, {companyData.province},{" "}
                  {companyData.postalCode}
                </Typography>
              </div>
            </CardContent>
          </Card>
        </div>
      </FormProvider>
      <LogoUploadModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        currentLogo={
          logoData?.imageUrl
            ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${logoData.imageUrl}`
            : null
        }
      />
    </>
  );
}
