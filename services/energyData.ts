import { JournalEntry } from "@/types/journal";

export type EnergyDataPoint = { value: number; label: string };

export const getEnergyData = (entries: JournalEntry[], timeRange: 'week' | 'month' | 'year'): EnergyDataPoint[] => {
  if (!entries || entries.length === 0) return [];

  const now = new Date();

  if (timeRange === 'week') {
    // Last 7 days ending today
    const data: EnergyDataPoint[] = [];
    for (let i = 6; i >= 0; i--) { // 6 → 0 to get last 7 days
      const day = new Date(now);
      day.setDate(now.getDate() - i);

      const dayEntries = entries.filter(e => {
        const eDate = new Date(e.createdAt);
        return eDate.getFullYear() === day.getFullYear() &&
          eDate.getMonth() === day.getMonth() &&
          eDate.getDate() === day.getDate();
      });

      const avg = dayEntries.length ? dayEntries.reduce((sum, e) => sum + e.energy, 0) / dayEntries.length : 0;
      const dayLabel = day.toLocaleDateString('en-US', { weekday: 'short' }); // 'Mon', 'Tue', etc.
      data.push({ value: Math.round(avg * 10) / 10, label: dayLabel });
    }
    return data;
  }

  if (timeRange === 'month') {
    // Last 4 weeks ending today
    const data: EnergyDataPoint[] = [];
    const startDay = new Date(now);
    startDay.setDate(now.getDate() - 27); // 28-day window
    const weeks = ['W1', 'W2', 'W3', 'W4'];

    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(startDay);
      weekStart.setDate(startDay.getDate() + i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const weekEntries = entries.filter(e => {
        const eDate = new Date(e.createdAt);
        return eDate >= weekStart && eDate <= weekEnd;
      });

      const avg = weekEntries.length ? weekEntries.reduce((sum, e) => sum + e.energy, 0) / weekEntries.length : 0;
      data.push({ value: Math.round(avg * 10) / 10, label: weeks[i] });
    }

    return data;
  }

  if (timeRange === 'year') {
    // Last 12 months ending this month
    const data: EnergyDataPoint[] = [];
    for (let i = 11; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);

      const monthEntries = entries.filter(e => {
        const eDate = new Date(e.createdAt);
        return eDate.getMonth() === month.getMonth() && eDate.getFullYear() === month.getFullYear();
      });

      const avg = monthEntries.length ? monthEntries.reduce((sum, e) => sum + e.energy, 0) / monthEntries.length : 0;
      const monthLabel = month.toLocaleDateString('en-US', { month: 'short' }); // 'Jan', 'Feb', etc.
      data.push({ value: Math.round(avg * 10) / 10, label: monthLabel });
    }
    return data;
  }

  return [];
};
