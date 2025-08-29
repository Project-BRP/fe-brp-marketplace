import { Dialog, DialogContent } from "@/components/Dialog"; // Asumsi path import
import NextImage from "@/components/NextImage"; // Asumsi path import
import Typography from "@/components/Typography"; // Asumsi path import
import Button from "@/components/buttons/Button"; // Asumsi path import
import { User as Users } from "@/types/users";
import { User } from "lucide-react";

interface DetailPelangganModalProps {
  isDetailModalOpen: boolean;
  setIsDetailModalOpen: (isOpen: boolean) => void;
  selectedCustomer: Users | null;
}

export const DetailPelangganModal = ({
  isDetailModalOpen,
  setIsDetailModalOpen,
  selectedCustomer,
}: DetailPelangganModalProps) => {
  if (!selectedCustomer) return null;
  const InfoItem = ({
    label,
    value,
  }: { label: string; value: React.ReactNode }) => (
    <div className="space-y-1">
      <Typography
        variant="p"
        weight="semibold"
        className="text-sm text-muted-foreground"
      >
        {label}
      </Typography>
      <Typography variant="p" className="text-foreground">
        {value}
      </Typography>
    </div>
  );

  return (
    <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
      <DialogContent className="max-w-md p-0">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Typography variant="h6" weight="bold">
            Detail Pelanggan
          </Typography>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Profile Picture Section */}
          <div className="relative w-32 h-32 mx-auto">
            <div className="w-full h-full rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {selectedCustomer.photoProfile ? (
                <NextImage
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${selectedCustomer.photoProfile}`}
                  alt={selectedCustomer.name}
                  width={128}
                  height={128}
                  className="rounded-full"
                  imgClassName="object-cover w-full h-full"
                />
              ) : (
                <User className="w-16 h-16 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* User Info Section */}
          <div className="gap-4 grid grid-cols-2 items-start">
            <InfoItem label="Nama" value={selectedCustomer.name} />
            <InfoItem label="Email" value={selectedCustomer.email} />
            <InfoItem
              label="Nomor Telepon"
              value={selectedCustomer.phoneNumber}
            />
            <InfoItem label="Peran" value={selectedCustomer.role} />
            <InfoItem
              label="Status"
              value={
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedCustomer.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedCustomer.isActive ? "Aktif" : "Tidak Aktif"}
                </span>
              }
            />
            <InfoItem
              label="Total Transaksi"
              value={selectedCustomer.totalTransaction}
            />
            <InfoItem
              label="Tanggal Bergabung"
              value={new Date(selectedCustomer.createdAt).toLocaleDateString(
                "id-ID",
                {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                },
              )}
            />
            <InfoItem
              label="Terakhir Diperbarui"
              value={new Date(selectedCustomer.updatedAt).toLocaleDateString(
                "id-ID",
                {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                },
              )}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end p-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDetailModalOpen(false)}
          >
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
