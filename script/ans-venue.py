import json
import re
from collections import Counter

# 加载数据
with open("data/data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# 正则：匹配括号及其内容
pattern = re.compile(r"（.*?）|\(.*?\)")

# 提取并清理演出场所
venues = []
for item in data:
    if "演出场所" in item:
        raw = item["演出场所"]
        # 删除括号和内容
        cleaned = re.sub(pattern, "", raw).strip()
        # 如果包含"餐饮"，跳过
        if "餐饮" in cleaned:
            continue
        if "酒店" in cleaned:
            continue
        venues.append(cleaned)

# 统计频率
counter = Counter(venues)

# 排序并只保留出现次数 >=2 的
sorted_venues = [(venue, count) for venue, count in counter.most_common() if count >=2]

# 打印结果
for venue, count in sorted_venues:
    print(f"{venue}: {count}")
