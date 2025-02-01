import { useWebSocketStore } from "@/store/useWebSocketStore";

export const getWsClient = () => {
  const store = useWebSocketStore.getState();
  if (!store.client) {
    store.initializeClient();
  }
  return store.client;
};

export default getWsClient;
