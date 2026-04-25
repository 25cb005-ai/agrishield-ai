import "./index-Vk38G6iG.js";
import { a as useQuery, u as useActor, c as createActor } from "./backend-DMzQOyye.js";
function useBackendActor() {
  return useActor(createActor);
}
function useListDiagnoses() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["diagnoses"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listDiagnosesByUser();
    },
    enabled: !!actor && !isFetching
  });
}
function useListOrders() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listOrdersByUser();
    },
    enabled: !!actor && !isFetching
  });
}
function useListPesticides() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["pesticides"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPesticides();
    },
    enabled: !!actor && !isFetching
  });
}
export {
  useListOrders as a,
  useListPesticides as b,
  useListDiagnoses as u
};
