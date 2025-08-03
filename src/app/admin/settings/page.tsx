"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Input } from "@/components/InputLovable";
import NextImage from "@/components/NextImage";
import { Textarea } from "@/components/TextArea";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import LabelText from "@/components/form/LabelText";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Building, Upload } from "lucide-react";
import { Check, Edit2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BiCart } from "react-icons/bi";
import LogoUploadModal from "./_components/LogoUploadModal";
import { useGetPPN, useUpdatePPN } from "./hooks/usePPN";

export default function AdminSettings() {
  // State Nama Toko
  const [editModeName, setEditModeName] = useState(false);

  // State Alamat Toko
  const [editModeAddress, setEditModeAddress] = useState(false);

  // State PPN
  const [editModePPN, setEditModePPN] = useState(false);
  const [ppnValue, setPpnValue] = useState("");

  const [storeName, setStoreName] = useState("PT. Bumi Rekayasa Persada");
  const [storeAddress, setStoreAddress] = useState(
    "Jl. Pertanian No. 123, Jakarta Selatan, Indonesia",
  );

  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  const { data: ppnData } = useGetPPN();
  useEffect(() => {
    if (ppnData) {
      console.log("PPN Data:", ppnData);
      setPpnValue(ppnData.percentage.toString());
    }
  }, [ppnData]);

  const { mutateAsync: updatePPN, isPending } = useUpdatePPN();

  // Save handlers
  const handleSaveName = async () => {
    console.info("Saving store name:", storeName);
  };

  const handleSaveAddress = async () => {
    console.info("Saving store address:", storeAddress);
  };

  const handleSavePPN = async () => {
    if (!ppnValue) {
      alert("PPN tidak boleh kosong");
      return;
    }
    try {
      await updatePPN({ percentage: parseFloat(ppnValue) });
      setEditModePPN(false);
    } catch (error) {
      console.error("Error saving PPN:", error);
    }
    console.info("Saving PPN:", ppnValue);
  };

  const { data: companyProfile } = useQuery({
    queryKey: ["company-profile"],
    queryFn: async () => {
      const res = await api.get("/config/logo");
      return res.data.data;
    },
  });

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pengaturan</h1>
          <p className="text-muted-foreground">
            Kelola pengaturan umum toko dan akun admin Anda
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Store Information Card */}
          <Card>
            <CardHeader className="w-full">
              <CardTitle className="flex flex-col items-center justify-between w-full">
                {companyProfile?.imageUrl && (
                  <NextImage
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${companyProfile.imageUrl}`}
                    alt="Company Logo"
                    width={200}
                    height={200}
                    className="rounded-full"
                    imgClassName="object-cover w-full h-full rounded-full"
                  />
                )}
                <div className="flex flex-row items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Informasi Toko
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsLogoModalOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {companyProfile?.imageUrl ? "Ganti Logo" : "Unggah Logo"}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <LabelText>Nama Toko</LabelText>
                {editModeName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      id="storeName"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleSaveName}
                      className="hover:bg-slate-200"
                    >
                      <Check className="size-5 text-green-500" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditModeName(false)}
                      className="hover:bg-slate-200"
                    >
                      <X className="size-5 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between group">
                    <Typography variant="p" className="text-foreground">
                      {storeName || "Belum diatur"}
                    </Typography>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditModeName(true)}
                      className="group-hover:bg-slate-400 p-3"
                    >
                      <Edit2 className="size-4 text-black" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Alamat Toko */}
              <div className="space-y-2">
                <LabelText>Alamat Toko</LabelText>
                {editModeAddress ? (
                  <div className="flex items-center gap-2">
                    <Textarea
                      id="storeAddress"
                      value={storeAddress}
                      onChange={(e) => setStoreAddress(e.target.value)}
                      rows={3}
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleSaveAddress}
                      className="hover:bg-slate-200"
                    >
                      <Check className="size-5 text-green-500" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditModeAddress(false)}
                      className="hover:bg-slate-200"
                    >
                      <X className="size-5 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between group">
                    <Typography
                      variant="p"
                      className="text-foreground whitespace-pre-line"
                    >
                      {storeAddress || "Belum diatur"}
                    </Typography>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditModeAddress(true)}
                      className="group-hover:bg-slate-400 p-3"
                    >
                      <Edit2 className="size-4 text-black" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BiCart className="size-7" />
                Konfigurasi Marketplace
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <LabelText>PPN</LabelText>

                {editModePPN ? (
                  <div className="flex items-center gap-2">
                    <Input
                      id="ppn"
                      type="number"
                      value={ppnValue}
                      onChange={(e) => setPpnValue(e.target.value)}
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleSavePPN}
                      className="hover:bg-slate-200"
                    >
                      <Check className="size-5 text-green-500" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditModePPN(false)}
                      className="hover:bg-slate-200"
                    >
                      <X className="size-5 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between group">
                    <Typography variant="p" className="text-foreground">
                      {ppnValue ? `${ppnValue}%` : "PPN belum diatur"}
                    </Typography>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditModePPN(true)}
                      className="group-hover:bg-slate-400 p-3"
                    >
                      <Edit2 className="size-4 text-black" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <LogoUploadModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        currentLogo={
          companyProfile?.imageUrl
            ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${companyProfile.imageUrl}`
            : null
        }
      />
    </>
  );
}
