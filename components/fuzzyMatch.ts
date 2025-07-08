// 通用模糊匹配函数，忽略大小写和空格
export function fuzzyMatch(a: string, b: string): boolean {
  if (!a || !b) return false;
  const norm = (s: string) => s.replace(/\s+/g, '').toLowerCase();
  return norm(a).includes(norm(b));
}
