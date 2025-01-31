export const mockSettings = {
    settings: [
      {
        id: "camera",
        label: "相机设置",
        icon: "Camera",
        settings: [
          {
            id: "exposure",
            label: "曝光时间",
            type: "range",
            value: 1000,
            min: 100,
            max: 5000,
            step: 100,
            validation: [
              { type: "min", value: 100, message: "最小曝光时间为100ms" },
              { type: "max", value: 5000, message: "最大曝光时间为5000ms" },
            ],
          },
          // ...more mock settings
        ],
      },
      // ...more mock groups
    ],
  };
  
  export const mockWebSocketStatus = {
    connected: true,
    latency: 45,
    lastMessage: new Date(),
    messageCount: 128,
  };
  