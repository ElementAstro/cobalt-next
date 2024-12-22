import * as z from "zod";

export interface HostapdConfig {
  ssid: string;
  wpa_passphrase: string;
  interface: string;
  driver: string;
  hw_mode: string;
  channel: number;
  wpa: number;
  wpa_key_mgmt: string;
  wpa_pairwise: string;
  rsn_pairwise: string;
  auth_algs: number;
  country_code: string;
  ieee80211n: 0 | 1;
  ieee80211ac: 0 | 1;
  wmm_enabled: 0 | 1;
  macaddr_acl: 0 | 1;
  ignore_broadcast_ssid: 0 | 1;
}

export const hostapdConfigSchema = z.object({
  ssid: z
    .string()
    .min(1, "SSID is required")
    .max(32, "SSID must be 32 characters or less"),
  wpa_passphrase: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(63, "Password must be 63 characters or less"),
  interface: z.string().min(1, "Interface is required"),
  driver: z.string().min(1, "Driver is required"),
  hw_mode: z.enum(["a", "b", "g"], {
    errorMap: () => ({ message: "Invalid hardware mode" }),
  }),
  channel: z
    .number()
    .int()
    .positive()
    .max(14, "Channel must be between 1 and 14"),
  wpa: z.number().int().min(1).max(2, "WPA must be either 1 or 2"),
  wpa_key_mgmt: z.string().min(1, "Key management is required"),
  wpa_pairwise: z.string().min(1, "WPA pairwise is required"),
  rsn_pairwise: z.string().min(1, "RSN pairwise is required"),
  auth_algs: z
    .number()
    .int()
    .min(1)
    .max(3, "Auth algorithms must be between 1 and 3"),
  country_code: z.string().length(2, "Country code must be 2 characters"),
  ieee80211n: z.enum(["0", "1"]).transform(Number),
  ieee80211ac: z.enum(["0", "1"]).transform(Number),
  wmm_enabled: z.enum(["0", "1"]).transform(Number),
  macaddr_acl: z.enum(["0", "1"]).transform(Number),
  ignore_broadcast_ssid: z.enum(["0", "1"]).transform(Number),
});

export const CHANNEL_OPTIONS = {
  "2.4GHz": Array.from({ length: 14 }, (_, i) => i + 1),
  "5GHz": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 144],
};
