import "react-image-crop/dist/ReactCrop.css";

import { useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
} from "react-image-crop";

import Button from "@/components/buttons/Button";

interface ImageCropperProps {
  imageSrc: string;
  onCrop: (croppedImage: Blob) => void;
  onClose: () => void;
  aspect?: number;
  width?: number;
  height?: number;
  isLogo?: boolean;
  flexibleCrop?: boolean; // Variabel baru untuk fleksibilitas
  circularCrop?: boolean;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

const ImageCropper = ({
  imageSrc,
  onCrop,
  onClose,
  aspect = 1,
  width = 400,
  height = 400,
  isLogo = false,
  flexibleCrop = false, // Nilai default false
  circularCrop = false,
}: ImageCropperProps) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    // Jika crop fleksibel, jangan paksakan aspek rasio saat pertama kali dimuat
    if (!flexibleCrop) {
      setCrop(centerAspectCrop(width, height, aspect));
    }
  };

  // Fungsi handleCrop tetap sama seperti sebelumnya
  const handleCrop = async () => {
    const image = imgRef.current;
    const canvas = previewCanvasRef.current;

    if (!image || !canvas || !completedCrop) {
      throw new Error("Crop details not available");
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    if (isLogo) {
      canvas.width = 500;
      canvas.height = 500;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("No 2d context");
      }
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cropX = completedCrop.x * scaleX;
      const cropY = completedCrop.y * scaleY;
      const cropWidth = completedCrop.width * scaleX;
      const cropHeight = completedCrop.height * scaleY;

      const cropAspectRatio = cropWidth / cropHeight;
      let drawWidth = 500;
      let drawHeight = 500;

      if (cropAspectRatio > 1) {
        drawHeight = 500 / cropAspectRatio;
      } else {
        drawWidth = 500 * cropAspectRatio;
      }

      const dx = (500 - drawWidth) / 2;
      const dy = (500 - drawHeight) / 2;

      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        dx,
        dy,
        drawWidth,
        drawHeight,
      );
    } else {
      const targetWidth = aspect === 1 ? width : 1920;
      const targetHeight = aspect === 1 ? height : 1080;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("No 2d context");
      }

      const cropX = completedCrop.x * scaleX;
      const cropY = completedCrop.y * scaleY;
      const cropWidth = completedCrop.width * scaleX;
      const cropHeight = completedCrop.height * scaleY;

      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        targetWidth,
        targetHeight,
      );
    }

    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCrop(blob);
        }
      },
      "image/jpeg",
      0.95,
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-background p-6 rounded-lg shadow-lg max-w-4xl w-full">
        <h2 className="text-xl font-bold mb-4 text-foreground">Crop Image</h2>
        <div className="flex justify-center">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={flexibleCrop ? undefined : aspect}
            circularCrop={circularCrop}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              onLoad={onImageLoad}
              style={{ maxHeight: "70vh" }}
              alt="Crop"
            />
          </ReactCrop>
        </div>
        <canvas ref={previewCanvasRef} className="hidden" />
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="green"
            onClick={handleCrop}
            disabled={!completedCrop?.width || !completedCrop?.height}
          >
            Crop & Simpan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
