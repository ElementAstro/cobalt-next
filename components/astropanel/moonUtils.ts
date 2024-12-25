export function calculateMoonPhase(date: Date): string {
  // 简单的月相计算示例
  const synodicMonth = 29.53058867;
  const baseDate = new Date("2000-01-06T18:14:00Z");
  const diff = (date.getTime() - baseDate.getTime()) / 86400000;
  const currentPhase = diff % synodicMonth;

  if (currentPhase < 1.84566) return "新月";
  if (currentPhase < 5.53699) return "眉月";
  if (currentPhase < 9.22831) return "上弦月";
  if (currentPhase < 12.91963) return "盈凸月";
  if (currentPhase < 16.61096) return "满月";
  if (currentPhase < 20.30228) return "亏凸月";
  if (currentPhase < 23.99361) return "下弦月";
  if (currentPhase < 27.68493) return "残月";
  return "新月";
}
