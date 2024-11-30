import { INDIDevice } from "@/types/indi";

export const initialDevices: INDIDevice[] = [
  {
    name: "CCD Simulator",
    state: "Disconnected",
    groups: [
      {
        name: "Main Control",
        properties: [
          {
            name: "connection",
            label: "Connection",
            group: "Main Control",
            state: "Ok",
            perm: "rw",
            type: "switch",
            value: true,
          },
          {
            name: "exposure",
            label: "Exposure",
            group: "Main Control",
            state: "Idle",
            perm: "rw",
            type: "number",
            value: 1.0,
            min: 0,
            max: 3600,
            step: 0.1,
            history: [],
          },
          {
            name: "temperature",
            label: "Temperature",
            group: "Main Control",
            state: "Busy",
            perm: "rw",
            type: "number",
            value: 0,
            min: -50,
            max: 50,
            step: 0.1,
            history: [],
          },
          {
            name: "cooler",
            label: "Cooler",
            group: "Main Control",
            state: "Ok",
            perm: "rw",
            type: "switch",
            value: true,
          },
        ],
      },
    ],
  },
  {
    name: "Telescope Simulator",
    state: "Disconnected",
    groups: [
      {
        name: "Main Control",
        properties: [
          {
            name: "connection",
            label: "Connection",
            group: "Main Control",
            state: "Ok",
            perm: "rw",
            type: "switch",
            value: true,
          },
        ],
      },
      {
        name: "Motion Control",
        properties: [
          {
            name: "ra",
            label: "Right Ascension",
            group: "Motion Control",
            state: "Idle",
            perm: "ro",
            type: "text",
            value: "10:00:00",
          },
          {
            name: "dec",
            label: "Declination",
            group: "Motion Control",
            state: "Idle",
            perm: "ro",
            type: "text",
            value: "+30:00:00",
          },
          {
            name: "track",
            label: "Tracking",
            group: "Motion Control",
            state: "Ok",
            perm: "rw",
            type: "switch",
            value: true,
          },
        ],
      },
    ],
  },
];
