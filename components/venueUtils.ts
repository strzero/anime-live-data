// 场馆归一化工具
import venueMap from '../data/venue-map.json';

export interface VenueMapItem {
  official: string;
  aliases: string[];
}

export function getOfficialVenueName(name: string | undefined | null): string | null {
  if (typeof name !== 'string') return null;
  for (const item of venueMap as VenueMapItem[]) {
    if (
      name === item.official ||
      item.aliases.some(alias => name.includes(alias)) ||
      item.official.includes(name)
    ) {
      return item.official;
    }
  }
  return null;
}

export function getVenueMatchKeywords(official: string): string[] {
  const item = (venueMap as VenueMapItem[]).find(i => i.official === official);
  return item ? [item.official, ...item.aliases] : [official];
}

export function getAllOfficialVenues(): VenueMapItem[] {
  return venueMap as VenueMapItem[];
}

// 去除最后一个括号及其内容（包括中英文括号），仅保留前面部分
export function stripVenueAddress(name: string | undefined | null): string {
  if (typeof name !== 'string') return '';
  // 匹配最后一个括号（中英文）及其内容
  return name.replace(/([（(][^（）()]*[）)])$/, '');
}
