"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Input } from "@/components/InputLovable";
import NextImage from "@/components/NextImage";
import { Textarea } from "@/components/TextArea";
import Button from "@/components/buttons/Button";
import LabelText from "@/components/form/LabelText";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Building, KeyRound, Save, Upload } from "lucide-react";
import { useState } from "react";
import LogoUploadModal from "./_components/LogoUploadModal";

export default function AdminSettings() {
  const [storeName, setStoreName] = useState("PT. Bumi Rekayasa Persada");
  const [storeAddress, setStoreAddress] = useState(
    "Jl. Pertanian No. 123, Jakarta Selatan, Indonesia",
  );
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  const { data: companyProfile } = useQuery({
    queryKey: ["company-profile"],
    queryFn: async () => {
      const res = await api.get("/config/logo");
      return res.data.data;
    },
  });

  const handleStoreInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add logic to update store info here
    alert("Informasi toko berhasil diperbarui!");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Password baru tidak cocok!");
      return;
    }
    // Add logic to update password here
    alert("Password berhasil diubah!");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

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
              <form onSubmit={handleStoreInfoSubmit} className="space-y-4">
                <div className="space-y-2">
                  <LabelText>Nama Toko</LabelText>
                  <Input
                    id="storeName"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <LabelText>Alamat Toko</LabelText>
                  <Textarea
                    id="storeAddress"
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Simpan Informasi
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5" />
                Ubah Password Admin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <LabelText>Password Lama</LabelText>
                  <Input
                    id="oldPassword"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <LabelText>Password Baru</LabelText>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <LabelText>Konfirmasi Password Baru</LabelText>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Ubah Password
                  </Button>
                </div>
              </form>
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
