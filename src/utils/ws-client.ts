import useWebSocketStore from "@/store/useWebSocketStore";

const wsClient = useWebSocketStore.getState().client;

export default wsClient;
