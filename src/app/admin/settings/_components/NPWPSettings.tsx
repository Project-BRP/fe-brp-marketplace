"use client";

import { Check, Edit, IdCard, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useUpdateCompanyInfo } from "@/app/admin/settings/hooks/useMutateCompany";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Skeleton } from "@/components/Skeleton";
import Typography from "@/components/Typography";
import IconButton from "@/components/buttons/IconButton";
import { useGetCompanyInfo } from "@/layouts/hooks/useCompanyInfo";

export default function NpwpSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [npwpValue, setNpwpValue] = useState("");

  const { data: companyInfo, isLoading: isCompanyLoading } =
    useGetCompanyInfo();
  const { mutate: updateCompanyInfo, isPending: isUpdating } =
    useUpdateCompanyInfo();

  useEffect(() => {
    if (companyInfo?.npwp) {
      setNpwpValue(companyInfo.npwp);
    }
  }, [companyInfo]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    if (companyInfo?.npwp) setNpwpValue(companyInfo.npwp);
  };

  const handleSave = () => {
    if (!npwpValue.trim()) return;
    updateCompanyInfo(
      { npwp: npwpValue },
      {
        onSuccess: () => setIsEditing(false),
      },
    );
  };

  if (isCompanyLoading) {
    return (
      <Card className="border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Skeleton className="h-6 w-6 mr-2 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-5 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <IdCard className="h-5 w-5 mr-2 text-primary" />
          <Typography variant="h6" className="font-bold">
            NPWP Perusahaan
          </Typography>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <Typography variant="p" color="muted">
                Nomor NPWP
              </Typography>
              {!isEditing ? (
                <Typography variant="h5" className="font-bold">
                  {companyInfo?.npwp || "Belum diatur"}
                </Typography>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={npwpValue}
                    onChange={(e) => setNpwpValue(e.target.value)}
                    className="h-9 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    autoFocus
                  />
                  <IconButton
                    icon={isUpdating ? Loader2 : Check}
                    variant="ghost"
                    className={`text-green-500 hover:bg-green-100 ${
                      isUpdating ? "animate-spin" : ""
                    }`}
                    onClick={handleSave}
                    disabled={isUpdating}
                  />
                  <IconButton
                    icon={X}
                    variant="ghost"
                    className="text-red-500 hover:bg-red-100"
                    onClick={handleCancel}
                    disabled={isUpdating}
                  />
                </div>
              )}
            </div>
          </div>
          {!isEditing && (
            <IconButton icon={Edit} variant="ghost" onClick={handleEdit} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
