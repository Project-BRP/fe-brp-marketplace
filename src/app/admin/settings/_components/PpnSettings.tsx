"use client";

import { Check, Edit, Loader2, Percent, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useGetPPN, useUpdatePPN } from "@/app/admin/settings/hooks/usePPN";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Skeleton } from "@/components/Skeleton";
import Typography from "@/components/Typography";
import IconButton from "@/components/buttons/IconButton";

/**
 * A component dedicated to managing PPN (VAT) settings.
 * It allows viewing and inline editing of the PPN percentage.
 */
export default function PpnSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [ppnValue, setPpnValue] = useState("");

  const { data: ppnData, isLoading: isPpnLoading } = useGetPPN();
  const { mutate: updatePPN, isPending: isUpdating } = useUpdatePPN();

  // Populate the input field with fetched PPN data.
  useEffect(() => {
    if (ppnData) {
      setPpnValue(ppnData.percentage.toString());
    }
  }, [ppnData]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Restore original value on cancel.
    if (ppnData) {
      setPpnValue(ppnData.percentage.toString());
    }
  };

  const handleSave = () => {
    const newPpn = parseFloat(ppnValue);
    if (isNaN(newPpn) || newPpn < 0) {
      // Basic validation, the hook might have more advanced logic.
      return;
    }
    updatePPN(
      { percentage: newPpn },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  if (isPpnLoading) {
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
          <Percent className="h-5 w-5 mr-2 text-primary" />
          <Typography variant="h6" className="font-bold">
            Konfigurasi PPN
          </Typography>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <Typography variant="p" color="muted">
                Persentase PPN
              </Typography>
              {!isEditing ? (
                <Typography variant="h5" className="font-bold">
                  {ppnData ? `${ppnData.percentage}%` : "Belum diatur"}
                </Typography>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  {/* Use a standard HTML input instead of the custom Input component */}
                  <input
                    id="percentage"
                    type="number"
                    value={ppnValue}
                    onChange={(e) => setPpnValue(e.target.value)}
                    className="h-9 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
