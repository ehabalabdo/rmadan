
import { PrayerTimes } from '../types';

export const fetchAmmanPrayerTimes = async (): Promise<PrayerTimes | null> => {
  try {
    const today = new Date();
    const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    const response = await fetch(`https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=Amman&country=Jordan&method=4`);
    const data = await response.json();
    if (data.code === 200) {
      return data.data.timings;
    }
    return null;
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    return null;
  }
};
