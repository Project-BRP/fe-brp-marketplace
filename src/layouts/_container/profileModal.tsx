"use client";

import {
  Camera,
  Check,
  Edit2,
  KeyRound,
  Loader2,
  LogOut,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import Input from "@/components/form/Input";
import { REG_PASS } from "@/constants/regex";
import { IUpdateUserData } from "@/types/auth";
import ImageCropper from "./ImageCropper";

// --- Form Values Type ---
type FormValues = {
  name: string;
  oldPassword: string;
  newPassword: string;
};

// --- User Profile Interface ---
export interface UserProfile {
  name: string | null;
  email: string | null;
  photoProfile: string | null;
}

// --- Component Props Interface ---
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdate: (formData: IUpdateUserData | FormData) => Promise<void>;
  isUpdating: boolean;
  onLogout: () => void;
  isLoggingOut: boolean;
}

export const ProfileModal = ({
  isOpen,
  onClose,
  user,
  onUpdate,
  isUpdating,
  onLogout,
  isLoggingOut,
}: ProfileModalProps) => {
  const methods = useForm<FormValues>({ mode: "onTouched" });
  const { handleSubmit, reset, watch } = methods;

  const [editMode, setEditMode] = useState<"none" | "name" | "password">(
    "none",
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user.photoProfile,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const newPasswordValue = watch("newPassword");

  // Effect to reset form state when the modal opens
  useEffect(() => {
    if (isOpen) {
      reset({ name: user.name || "", oldPassword: "", newPassword: "" });
      setPreviewUrl(
        user.photoProfile
          ? process.env.NEXT_PUBLIC_IMAGE_URL + user.photoProfile
          : null,
      );
      setSelectedFile(null);
      setEditMode("none");
    }
  }, [isOpen, user, reset]);

  if (!isOpen) return null;

  // --- Event Handlers ---
  const handleFileSelect = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setSelectedFile(null); // Reset selected file before cropping
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => setImageToCrop(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = (croppedImage: Blob) => {
    const file = new File([croppedImage], "profile.jpg", {
      type: "image/jpeg",
    });
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setImageToCrop(null);
  };

  const handleCancelEdit = () => {
    reset({ name: user.name || "", oldPassword: "", newPassword: "" });
    setEditMode("none");
  };

  const onSaveName = async (data: FormValues) => {
    await onUpdate({ name: data.name });
    setEditMode("none");
  };

  const onSavePassword = async (data: FormValues) => {
    await onUpdate({
      oldPassword: data.oldPassword,
      password: data.newPassword,
    });
    setEditMode("none");
  };

  const handleSavePhoto = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);
      await onUpdate(formData);
      setSelectedFile(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
      {imageToCrop && (
        <ImageCropper
          imageSrc={imageToCrop}
          onCrop={handleCrop}
          onClose={() => setImageToCrop(null)}
        />
      )}
      <FormProvider {...methods}>
        <div className="bg-background rounded-lg shadow-xl w-full h-full sm:h-auto sm:max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Typography variant="h6" weight="bold">
              User Profile
            </Typography>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1"
            >
              <X className="size-5" />
            </Button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6">
            {/* Profile Picture Section */}
            <div className="relative w-32 h-32 mx-auto group">
              <div className="w-full h-full rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <NextImage
                    src={previewUrl}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="rounded-full"
                    imgClassName="object-cover w-full h-full"
                  />
                ) : (
                  <User className="w-16 h-16 text-muted-foreground" />
                )}
              </div>
              <button
                type="button"
                onClick={handleFileSelect}
                className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-8 h-8 text-white" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg"
              />
            </div>

            {/* User Info Section */}
            <div className="space-y-4">
              {/* Name Field */}
              <div className="space-y-1">
                <Typography
                  variant="p"
                  weight="semibold"
                  className="text-muted-foreground"
                >
                  Nama
                </Typography>
                {editMode === "name" ? (
                  <div className="flex items-center gap-2">
                    <Input
                      id="name"
                      validation={{ required: "Nama tidak boleh kosong" }}
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleSubmit(onSaveName)}
                      disabled={isUpdating}
                      className="hover:bg-slate-200"
                    >
                      <Check className="size-5 text-green-500" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="hover:bg-slate-200"
                    >
                      <X className="size-5 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between group">
                    <Typography variant="p" className="text-foreground">
                      {user.name}
                    </Typography>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditMode("name")}
                      disabled={editMode === "password"}
                      className=" group-hover:bg-slate-400 p-3 disabled:opacity-20"
                    >
                      <Edit2 className="size-4 text-black" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <Typography
                  variant="p"
                  weight="semibold"
                  className="text-muted-foreground"
                >
                  Email
                </Typography>
                <Typography
                  variant="p"
                  className="text-foreground text-opacity-70"
                >
                  {user.email}
                </Typography>
              </div>

              {/* Password Section */}
              <div className="space-y-2">
                {editMode === "password" ? (
                  <div className="space-y-4 pt-2">
                    <Input
                      id="oldPassword"
                      label="Old Password"
                      type="password"
                      placeholder="Masukkan password lama Anda"
                      validation={{
                        required: newPasswordValue
                          ? "Password lama tidak boleh kosong"
                          : false,
                      }}
                    />
                    <Input
                      id="newPassword"
                      label="New Password"
                      type="password"
                      placeholder="Masukkan password baru Anda"
                      validation={{
                        required: "Password tidak boleh kosong!",
                        pattern: {
                          value: REG_PASS,
                          message:
                            "Password harus mengandung huruf besar, huruf kecil, angka, simbol, dan minimal 8 karakter!",
                        },
                      }}
                    />
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        Batal
                      </Button>
                      <Button
                        type="button"
                        variant="green"
                        onClick={handleSubmit(onSavePassword)}
                        disabled={isUpdating}
                      >
                        Simpan Password
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="p-2 h-auto"
                    onClick={() => setEditMode("password")}
                    disabled={editMode === "name"}
                  >
                    <KeyRound className="mr-2 size-4" /> Ganti Password
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between p-4 border-t border-border">
            <Button
              type="button"
              variant="red"
              onClick={onLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2"
            >
              <LogOut className="size-4" />
              {isLoggingOut ? "Logging out..." : "Log Out"}
            </Button>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Tutup
              </Button>
              <Button
                type="button"
                variant="green"
                onClick={handleSavePhoto}
                disabled={isUpdating || !selectedFile}
              >
                {isUpdating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Simpan Foto
              </Button>
            </div>
          </div>
        </div>
      </FormProvider>
      <style jsx>{`
				@keyframes fade-in-scale {
					from {
						opacity: 0;
						transform: scale(0.95);
					}
					to {
						opacity: 1;
						transform: scale(1);
					}
				}
				.animate-fade-in-scale {
					animation: fade-in-scale 0.3s forwards;
				}
			`}</style>
    </div>
  );
};
