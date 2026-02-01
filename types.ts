
export interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
}

export interface Dua {
  id: number;
  category: string;
  text: string;
  source: string;
}

export interface DailyDua {
  day: number;
  text: string;
}

export interface Series {
  id: number;
  title: string;
  genre: string;
  channel: string;
  image: string;
}

export enum AppTab {
  HOME = 'home',
  DUAS = 'duas',
  CHEF = 'chef',
  SERIES = 'series',
  TOOLS = 'tools'
}
