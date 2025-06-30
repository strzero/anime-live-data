import requests
import json
from bs4 import BeautifulSoup
import os
import re
from datetime import datetime, timedelta

BASE_URL = "http://wsbs.wgj.sh.gov.cn"
LIST_URL = BASE_URL + "/shwgj_ywtb/core/web/welcome/index!toResultNotice.action?flag=1"
JSON_FILE = "data/data.json"
INFO_FILE = "data/info.json"
MAX_PAGES = 1500

session = requests.Session()
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36"
}


def extract_dates(text):
    """
    从演出日期文本中提取所有 yyyy-mm-dd 格式的日期
    """
    date_list = []
    base_year = None
    base_month = None

    pattern_range = re.compile(
        r"(\d{4})年(\d{1,2})月(\d{1,2})日[至\-–—]"
        r"(?:(\d{4})年)?"
        r"(?:(\d{1,2})月)?"
        r"(\d{1,2})日"
    )
    pattern_full = re.compile(r"(\d{4})年(\d{1,2})月(\d{1,2})日")
    pattern_partial = re.compile(r"(?<!年)(\d{1,2})月(\d{1,2})日")
    pattern_day = re.compile(r"(?<!月)(?<!年)(?<!\d)(\d{1,2})日")

    # 范围
    for m in pattern_range.finditer(text):
        y1 = int(m.group(1))
        m1 = int(m.group(2))
        d1 = int(m.group(3))
        y2 = int(m.group(4)) if m.group(4) else y1
        m2 = int(m.group(5)) if m.group(5) else m1
        d2 = int(m.group(6))
        start = datetime(y1, m1, d1)
        end = datetime(y2, m2, d2)
        while start <= end:
            date_list.append(start.strftime("%Y-%m-%d"))
            start += timedelta(days=1)

    text = pattern_range.sub("", text)

    # 完整
    for m in pattern_full.finditer(text):
        y, mo, d = map(int, m.groups())
        date_list.append(f"{y:04d}-{mo:02d}-{d:02d}")
        base_year, base_month = y, mo

    text = pattern_full.sub("", text)

    # 部分
    for m in pattern_partial.finditer(text):
        mo, d = map(int, m.groups())
        y = base_year or datetime.now().year
        date_list.append(f"{y:04d}-{mo:02d}-{d:02d}")
        base_month = mo

    text = pattern_partial.sub("", text)

    # 仅日
    for m in pattern_day.finditer(text):
        d = int(m.group(1))
        y = base_year or datetime.now().year
        mo = base_month or 1
        date_list.append(f"{y:04d}-{mo:02d}-{d:02d}")

    return sorted(set(date_list))


def parse_detail(url):
    resp = session.get(url, headers=headers)
    resp.encoding = "utf-8"
    soup = BeautifulSoup(resp.text, "html.parser")
    content = soup.select_one("div.content")
    if not content:
        return None

    spans = content.select("span")
    if len(spans) < 2:
        return None

    受理编号 = spans[0].text.replace("受理编号：", "").strip()
    批文号 = spans[1].text.replace("批文号：", "").strip()

    tables = content.find_all("table")
    if len(tables) < 2:
        return None

    main_table = tables[0]
    rows = main_table.find_all("tr")
    if len(rows) < 8:
        return None

    cells = {}
    for i, row in enumerate(rows):
        tds = row.find_all("td")
        if i == 0:
            cells["许可事项"] = tds[1].text.strip()
            cells["许可事项类型"] = tds[2].text.strip()
        if i == 1:
            cells["举办单位"] = tds[1].text.strip()
            cells["许可证号"] = tds[3].text.strip()
        if i == 2:
            cells["演出名称"] = tds[1].text.strip()
            cells["原批文号"] = tds[3].text.strip()
        if i == 3:
            cells["演出日期"] = tds[1].text.strip()
            cells["演出日期数据"] = extract_dates(cells["演出日期"])
        if i == 4:
            cells["演出场所"] = tds[1].text.strip()
        if i == 5:
            cells["演员人数"] = tds[1].text.strip()
            cells["场次"] = tds[3].text.strip()
        if i == 6:
            cells["是否外国人短期工作"] = tds[1].text.strip()
        if i == 7:
            cells["演出内容"] = tds[1].text.strip()

    time_divs = content.find_all("div", align="right")
    审批时间 = time_divs[-1].text.strip() if time_divs else ""

    actor_table = tables[1]
    actor_rows = actor_table.find_all("tr")[1:]
    演员名单 = []
    for r in actor_rows:
        tds = r.find_all("td")
        if len(tds) < 5:
            continue
        演员名单.append({
            "序号": tds[0].text.strip(),
            "姓名": tds[1].text.strip(),
            "性别": tds[2].text.strip(),
            "国籍": tds[3].text.strip(),
            "证件号": tds[4].text.strip()
        })

    return {
        "受理编号": 受理编号,
        "批文号": 批文号,
        "许可事项": cells.get("许可事项", ""),
        "许可事项类型": cells.get("许可事项类型", ""),
        "举办单位": cells.get("举办单位", ""),
        "许可证号": cells.get("许可证号", ""),
        "演出名称": cells.get("演出名称", ""),
        "原批文号": cells.get("原批文号", ""),
        "演出日期": cells.get("演出日期", ""),
        "演出日期数据": cells.get("演出日期数据", []),
        "演出场所": cells.get("演出场所", ""),
        "演员人数": cells.get("演员人数", ""),
        "场次": cells.get("场次", ""),
        "是否外国人短期工作": cells.get("是否外国人短期工作", ""),
        "演出内容": cells.get("演出内容", ""),
        "审批时间": 审批时间,
        "演员名单": 演员名单,
        "详情页URL": url
    }


if os.path.exists(JSON_FILE):
    with open(JSON_FILE, "r", encoding="utf-8") as f:
        stored_data = json.load(f)
else:
    stored_data = []

existing_batch_numbers = set(item.get("批文号", "") for item in stored_data)

new_items = []
stop_flag = False
consecutive_existing = 0

for page in range(1, MAX_PAGES + 1):
    print(f"抓取第 {page} 页...")
    resp = session.post(LIST_URL, headers=headers, data={"pageDoc.pageNo": str(page)})
    resp.encoding = "utf-8"
    soup = BeautifulSoup(resp.text, "html.parser")
    rows = soup.select("div#div_md table tr[align='left']")
    if not rows:
        print("没有更多内容")
        break

    for row in rows:
        a = row.find("a")
        if not a:
            continue
        href = a.get("href")
        detail_url = BASE_URL + href
        try:
            data = parse_detail(detail_url)
        except Exception as e:
            print(f"解析详情页出错，跳过: {detail_url}，错误：{e}")
            continue
        if not data:
            print("此详情页格式不符，跳过")
            continue

        batch_number = data.get("批文号", "")
        if not batch_number:
            print("无批文号，跳过")
            continue

        if batch_number in existing_batch_numbers:
            consecutive_existing += 1
            print(f"遇到已存储数据批文号 {batch_number}，连续命中 {consecutive_existing}")
            if consecutive_existing >= 3:
                print("连续3条已存在，停止")
                stop_flag = True
                break
            continue
        else:
            consecutive_existing = 0

        print(f"新增: {batch_number}")
        new_items.append(data)
        existing_batch_numbers.add(batch_number)

    if stop_flag:
        break

stored_data = new_items + stored_data

with open(JSON_FILE, "w", encoding="utf-8") as f:
    json.dump(stored_data, f, ensure_ascii=False, indent=2)

info = {
    "检查时间": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "是否更新": bool(new_items),
    "新增数量": len(new_items)
}

if os.path.exists(INFO_FILE):
    with open(INFO_FILE, "r", encoding="utf-8") as f:
        try:
            info_history = json.load(f)
            if not isinstance(info_history, list):
                info_history = []
        except Exception:
            info_history = []
else:
    info_history = []

if info["是否更新"]:
    info_history.append(info)
    with open(INFO_FILE, "w", encoding="utf-8") as f:
        json.dump(info_history, f, ensure_ascii=False, indent=2)

print(f"更新完成，共 {len(stored_data)} 条记录")
