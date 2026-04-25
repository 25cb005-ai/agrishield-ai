import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { CropDiagnosis, Order, Pesticide } from "../types";

function useBackendActor() {
  return useActor(createActor);
}

export function useListDiagnoses() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<CropDiagnosis[]>({
    queryKey: ["diagnoses"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listDiagnosesByUser();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListOrders() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listOrdersByUser();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListPesticides() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Pesticide[]>({
    queryKey: ["pesticides"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPesticides();
    },
    enabled: !!actor && !isFetching,
  });
}
