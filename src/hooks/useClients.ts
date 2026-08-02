// src/hooks/useClients.ts
import { useGetClientQuery } from "@/redux/services/homepage/homePage.api";

export interface Client {
  id: number;
  name: string;
  logo: string;
  is_active: number | string;
  sort_order: number | string;
  created_at: string;
  updated_at: string;
  image_url: string;
}

export function useClients() {
  const { data, isLoading, isError } = useGetClientQuery({});

  const rawClients: Client[] = data?.data ?? [];

  const clients = rawClients
    .filter((client) => Number(client.is_active) === 1)
    .sort((a, b) => Number(a.sort_order) - Number(b.sort_order));

  return {
    clients,
    isLoading,
    isError,
  };
}