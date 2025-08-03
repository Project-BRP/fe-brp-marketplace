"use client";

import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function FaviconLoader() {
  const { data: companyProfile } = useQuery({
    queryKey: ["company-profile"],
    queryFn: async () => {
      const res = await api.get("/config/logo");
      return res.data.data;
    },
  });

  useEffect(() => {
    if (companyProfile?.imageUrl) {
      const link =
        (document.querySelector("link[rel*='icon']") as HTMLLinkElement) ||
        (document.createElement("link") as HTMLLinkElement);
      link.type = "image/x-icon";
      link.rel = "icon";
      link.href = `${process.env.NEXT_PUBLIC_IMAGE_URL}${companyProfile.imageUrl}`;
      document.head.appendChild(link);
    }
  }, [companyProfile]);

  return null;
}
