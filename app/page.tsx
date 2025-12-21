"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function TestPage() {
  const { isLoading, error } = useQuery({
    queryKey: ["ping"],
    queryFn: async () => {
      const res = await api.get("/health");
      return res.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return <div>API OK</div>;
}
