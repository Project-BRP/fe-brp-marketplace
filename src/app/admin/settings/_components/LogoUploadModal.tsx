"use client";

import { Camera, Loader2, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog";
import NextImage from "@/components/NextImage";
import Button from "@/components/buttons/Button";
import ImageCropper from "@/layouts/_container/ImageCropper";
import { useUpdateCompanyLogo } from "../hooks/useCompanyProfile";

interface LogoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLogo: string | null;
}

export default function LogoUploadModal({
  isOpen,
  onClose,
  currentLogo,
}: LogoUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: updateLogo, isPending: isUpdating } = useUpdateCompanyLogo();

  const handleFileSelect = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => setImageToCrop(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = (croppedImage: Blob) => {
    const file = new File([croppedImage], "logo.jpg", { type: "image/jpeg" });
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setImageToCrop(null);
  };

  const handleSave = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);
      updateLogo(formData, {
        onSuccess: () => {
          toast.success("Logo berhasil diunggah!");
          onClose();
          setPreviewUrl(null);
        },
      });
    }
  };

  useEffect(() => {
    setSelectedFile(null);
    setImageToCrop(null);
    setPreviewUrl(currentLogo);
  }, [currentLogo, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unggah Logo Perusahaan</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div
            className="relative mx-auto min-h-40 h-fit min-w-40 w-fit cursor-pointer rounded-full bg-muted group"
            onClick={handleFileSelect}
          >
            {previewUrl ? (
              <NextImage
                src={previewUrl}
                alt="Logo"
                width={500}
                height={500}
                className="rounded-full w-full h-full"
                imgClassName="object-cover w-full h-full rounded-full"
              />
            ) : (
              <div className="flex min-h-40 min-w-40 items-center justify-center rounded-full">
                <Camera className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-8 w-8 text-white" />
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg"
          />
        </div>
        {imageToCrop && (
          <ImageCropper
            imageSrc={imageToCrop}
            onCrop={handleCrop}
            onClose={() => setImageToCrop(null)}
            aspect={1}
            width={500}
            height={500}
            circularCrop={false}
            isLogo
            flexibleCrop
          />
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSave} disabled={!selectedFile || isUpdating}>
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
