"use client";

import { useEffect } from "react";
import { FaCreditCard } from "react-icons/fa"; // Pastikan Anda sudah install react-icons

// --- UI Components ---
import { Skeleton } from "@/components/Skeleton"; // Asumsi Anda punya komponen Skeleton
import Typography from "@/components/Typography"; // Asumsi Anda punya komponen Typography
import { useRequestPayment } from "../../hooks/useTransaction";

const PaymentGateway = ({ Id }: { Id: string }) => {
  // 1. Panggil hook `useRequestPayment`
  const {
    mutate: requestPayment,
    data: reqPaymentData,
    isPending, // State untuk loading
    isError, // State untuk error
    error, // Objek error jika terjadi
  } = useRequestPayment();

  // 2. useEffect untuk memuat script Midtrans (tidak ada perubahan)
  useEffect(() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    let script = document.querySelector(`script[src="${midtransScriptUrl}"]`);

    if (!script) {
      script = document.createElement("script");
      (script as HTMLScriptElement).src = midtransScriptUrl;
      const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
      if (!clientKey) {
        console.error("NEXT_PUBLIC_MIDTRANS_CLIENT_KEY is not defined");
        return;
      }
      script.setAttribute("data-client-key", clientKey);
      document.head.appendChild(script);
    }

    return () => {
      // Script tidak perlu dihapus agar tidak loading ulang jika komponen lain butuh
    };
  }, []);

  // 3. useEffect untuk memicu permintaan pembayaran saat komponen dimuat
  useEffect(() => {
    // Pastikan Id sudah tersedia sebelum memanggil API
    if (Id) {
      requestPayment({ transactionId: Id });
    }
  }, [Id, requestPayment]); // Dependencies: jalankan ulang jika Id atau fungsi requestPayment berubah

  // 4. Fungsi untuk merender konten secara kondisional
  const renderPaymentContent = () => {
    // Saat sedang memuat data URL pembayaran
    if (isPending) {
      return (
        <div className="w-full h-[600px] border rounded-lg flex items-center justify-center p-4">
          <div className="text-center space-y-3">
            <Skeleton className="h-16 w-16 rounded-lg mx-auto" />
            <Skeleton className="h-5 w-48 mx-auto" />
            <Typography variant="p" className="text-muted-foreground">
              Sedang menyiapkan gateway pembayaran...
            </Typography>
          </div>
        </div>
      );
    }

    // Jika terjadi error saat mengambil data
    if (isError) {
      return (
        <div className="w-full h-[600px] border rounded-lg flex items-center justify-center p-4 bg-red-50 text-red-800">
          <div className="text-center">
            <Typography variant="h6" className="font-bold">
              Gagal Memuat Pembayaran
            </Typography>
            <Typography variant="p" className="mt-1">
              {error?.message || "Terjadi kesalahan. Silakan coba lagi nanti."}
            </Typography>
          </div>
        </div>
      );
    }

    // Jika berhasil dan URL tersedia, tampilkan iframe
    if (reqPaymentData?.data.snapUrl) {
      return (
        <div className="w-full h-[600px] border rounded-lg overflow-hidden">
          <iframe
            src={reqPaymentData.data.snapUrl}
            className="w-full h-full border-0"
            title="Midtrans Payment"
          ></iframe>
        </div>
      );
    }

    // Fallback jika tidak ada kondisi yang terpenuhi
    return null;
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FaCreditCard /> Selesaikan Pembayaran
      </h3>
      {renderPaymentContent()}
    </div>
  );
};

export default PaymentGateway;
