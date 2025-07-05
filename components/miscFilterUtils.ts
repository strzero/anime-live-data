// 用于判断演出是否属于“杂项”或需隐藏的工具函数
import miscFilter from '@/data/misc-filter.json';
import { Show } from '@/components/ShowTable';

export function isMiscOrHidden(show: Show): boolean {
  // 完全匹配
  if (miscFilter.exact.includes(show.演出名称)) return true;
  // 关键词匹配
  if (miscFilter.keywords.some((kw: string) => show.演出名称.includes(kw))) return true;
  // 场所或举办单位包含“餐饮”
  if (
    miscFilter.venueOrOrganizer.some((kw: string) =>
      (show.演出场所 && show.演出场所.includes(kw)) ||
      (show.举办单位 && show.举办单位.includes(kw))
    )
  ) return true;
  return false;
}
