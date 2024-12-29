import { SettingGroup, Setting } from "@/types/config";

export const getSettingByPath = (
  groups: SettingGroup[],
  path: string[]
): Setting | null => {
  let currentGroups = groups;
  let currentSetting: Setting | null = null;

  for (const segment of path) {
    const group = currentGroups.find((g) => g.id === segment);
    if (!group) return null;
    currentGroups = group.settings.filter(
      (s) => "settings" in s
    ) as SettingGroup[];
  }

  return currentSetting;
};
