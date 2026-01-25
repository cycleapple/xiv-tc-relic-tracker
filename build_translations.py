# -*- coding: utf-8 -*-
"""
Build CN to TC translation mapping for FF14 items
Downloads Item.csv from both CN and TC datamining repos
"""

import urllib.request
import csv
import json
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

# URLs for item data
CN_ITEM_URL = "https://raw.githubusercontent.com/thewakingsands/ffxiv-datamining-cn/master/Item.csv"
TC_ITEM_URL = "https://raw.githubusercontent.com/miaki3457/ffxiv-datamining-tc/master/csv/Item.csv"

# Output directory
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

def download_file(url, filename):
    """Download a file from URL"""
    print(f"Downloading {filename}...")
    try:
        urllib.request.urlretrieve(url, filename)
        print(f"Downloaded {filename}")
        return True
    except Exception as e:
        print(f"Failed to download {filename}: {e}")
        return False

def parse_item_csv(filename):
    """Parse Item.csv and return dict of id -> name"""
    items = {}
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            # Skip header rows (usually 3 rows)
            next(reader)  # key, ...
            next(reader)  # #, ...
            next(reader)  # int32, ...

            for row in reader:
                if len(row) > 10:
                    item_id = row[0]
                    # Name is usually in column 10 (index 9) or similar
                    # Let's check multiple columns for the name
                    item_name = row[9] if len(row) > 9 else ""
                    if item_name and item_id.isdigit():
                        items[item_id] = item_name
    except Exception as e:
        print(f"Error parsing {filename}: {e}")
    return items

def build_translation_map(cn_items, tc_items):
    """Build CN to TC translation map"""
    cn_to_tc = {}
    for item_id, cn_name in cn_items.items():
        if item_id in tc_items:
            tc_name = tc_items[item_id]
            if cn_name and tc_name and cn_name != tc_name:
                cn_to_tc[cn_name] = tc_name
    return cn_to_tc

# Known relic-related item translations (manual mapping for key items)
KNOWN_TRANSLATIONS = {
    # Manderville materials
    "稀少陨石": "稀少隕石",
    "稀少球粒陨石": "稀少球粒隕石",
    "稀少无球粒陨石": "稀少無球粒隕石",
    "雏晶": "雛晶",

    # Aetherial materials
    "新月矿石": "新月礦石",
    "上弦月矿石": "上弦月礦石",
    "青色半魂晶": "青色半魂晶",
    "碧色半魂晶": "碧色半魂晶",
    "绿色半魂晶": "綠色半魂晶",
    "橙色半魂晶": "橙色半魂晶",
    "紫色半魂晶": "紫色半魂晶",
    "黄色半魂晶": "黃色半魂晶",
    "犎牛胶": "犎牛膠",
    "乌托姆陨铁": "烏托姆隕鐵",
    "人造暗物质α": "人造暗物質α",
    "人造暗物质β": "人造暗物質β",
    "人造暗物质γ": "人造暗物質γ",

    # Resistance materials
    "萨维奈灵鳞粉": "薩維奈靈鱗粉",
    "烦恼的记忆晶块": "煩惱的記憶晶塊",
    "悲伤的记忆晶块": "悲傷的記憶晶塊",
    "恐惧的记忆晶块": "恐懼的記憶晶塊",
    "勇猛的记忆晶块": "勇猛的記憶晶塊",
    "厌恶的记忆晶块": "厭惡的記憶晶塊",
    "不祥的记忆晶块": "不祥的記憶晶塊",
    "忌讳的记忆晶块": "忌諱的記憶晶塊",
    "被丢掉的遗物": "被丟掉的遺物",
    "超小型传动轴": "超小型傳動軸",
    "超小型弹簧": "超小型彈簧",
    "激战记录：第一集": "激戰記錄：第一集",
    "激战记录：第二集": "激戰記錄：第二集",
    "沉重的记忆晶块": "沉重的記憶晶塊",
    "粗暴的记忆晶块": "粗暴的記憶晶塊",
    "光辉的激情晶块": "光輝的激情晶塊",

    # Eureka materials
    "乱属性水晶": "亂屬性水晶",
    "帕祖祖的羽毛": "帕祖祖的羽毛",
    "结冰乱属性水晶": "結冰亂屬性水晶",
    "恒冰水晶": "恆冰水晶",
    "娄希的冰片": "婁希的冰片",
    "涌火水晶": "涌火水晶",
    "彭忒西勒亚的火种": "彭忒西勒亞的火種",
    "丰水水晶": "豐水水晶",
    "结晶龙鳞": "結晶龍鱗",
    "优雷卡碎晶": "優雷卡碎晶",

    # Anima materials
    "星极水晶": "星極水晶",
    "灵极水晶": "靈極水晶",
    "附魔橡胶": "附魔橡膠",
    "亚拉戈上级硬化药": "亞拉戈上級硬化藥",
    "亚拉戈上级魔触媒": "亞拉戈上級魔觸媒",
    "神圣水": "神聖水",
    "亚拉戈绝灵油": "亞拉戈絕靈油",
    "水晶砂": "水晶砂",
    "硬灵性岩": "硬靈性岩",
    "活性化晶簇": "活性化晶簇",
    "晶化气体": "晶化氣體",
    "神秘骨片": "神秘骨片",
    "神秘贝壳": "神秘貝殼",
    "神秘种子": "神秘種子",
    "神秘原石": "神秘原石",
    "精金投斧": "精金投斧",
    "钛合金镜": "鈦合金鏡",
    "国王饼": "國王餅",
    "破魔箭": "破魔箭",

    # Zodiac materials
    "原型武器": "原型武器",
    "拉札罕淬火油": "拉札罕淬火油",
    "萨维奈灵药": "薩維奈靈藥",
    "十二魂晶": "十二魂晶",
    "高位附魔墨水": "高位附魔墨水",
    "圣泉水": "聖泉水",
    "炸弹核心": "炸彈核心",
    "安穆德羊皮纸": "安穆德羊皮紙",
    "瑪哈特瑪": "瑪哈特瑪",
    "水天一卷": "水天一卷",
    "风天一卷": "風天一卷",
    "水天二卷": "水天二卷",
    "水狱一卷": "水獄一卷",
    "火天一卷": "火天一卷",
    "火天二卷": "火天二卷",
    "火狱一卷": "火獄一卷",
    "土天一卷": "土天一卷",
    "风天二卷": "風天二卷",

    # Skysteel materials
    "改良用的硅化木": "改良用的矽化木",
    "改良用的铁砂": "改良用的鐵砂",
    "改良用的铁矿": "改良用的鐵礦",
    "改良用的原石": "改良用的原石",
    "改良用的粗皮": "改良用的粗皮",
    "改良用的棉花": "改良用的棉花",
    "改良用的岩盐": "改良用的岩鹽",
    "改良用的小麦": "改良用的小麥",
    "白梣木原木": "白梣木原木",
    "魔银砂": "魔銀砂",
    "野蛮盗龙的粗皮": "野蠻盜龍的粗皮",
    "仙子棉": "仙子棉",
    "精金砂": "精金砂",
    "高岭胡萝卜": "高嶺胡蘿蔔",
    "沙柚木木材": "沙柚木木材",
    "钛铜锭": "鈦銅錠",
    "凝灰岩磨刀石": "凝灰岩磨刀石",
    "缠尾蛟革": "纏尾蛟革",
    "力山羊毛布": "力山羊毛布",
    "白金锭": "白金錠",
    "矮人面包": "矮人麵包",
    "改良用雪松原木": "改良用雪松原木",
    "改良用饼铁矿": "改良用餅鐵礦",
    "改良用灵银砂": "改良用靈銀砂",
    "改良用银矿": "改良用銀礦",
    "改良用迦迦纳怪鸟的粗皮": "改良用迦迦納怪鳥的粗皮",
    "改良用绵羊毛": "改良用綿羊毛",
    "改良用天然水": "改良用天然水",
    "改良用甜菜": "改良用甜菜",
    "愈疮木原木": "癒瘡木原木",
    "暗银矿": "暗銀礦",
    "暗银砂": "暗銀砂",
    "黄明矾": "黃明礬",
    "矮人棉": "矮人棉",
    "矮人面粉": "矮人麵粉",
    "愈疮木木材": "癒瘡木木材",
    "矮人银锭": "矮人銀錠",
    "矮人银块": "矮人銀塊",
    "海燕革": "海燕革",
    "矮人棉布": "矮人棉布",
    "最终改良用松木原木": "最終改良用松木原木",
    "最终改良用清银矿": "最終改良用清銀礦",
    "最终改良用白钨矿": "最終改良用白鎢礦",
    "最终改良用苍天石原石": "最終改良用蒼天石原石",
    "最终改良用瞪羚的粗皮": "最終改良用瞪羚的粗皮",
    "最终改良用苎麻": "最終改良用苧麻",
    "最终改良用沼地盐": "最終改良用沼地鹽",
    "最终改良用小麦": "最終改良用小麥",
    "第四期重建用的特供原木（检）": "第四期重建用的特供原木（檢）",
    "第四期重建用的特供矿石（检）": "第四期重建用的特供礦石（檢）",
    "第四期重建用的特供硅砂（检）": "第四期重建用的特供矽砂（檢）",
    "第四期重建用的特供木贼草（检）": "第四期重建用的特供木賊草（檢）",
    "第四期重建用的特供彩虹晶（检）": "第四期重建用的特供彩虹晶（檢）",
    "第四期重建用的特供凯门鳄（检）": "第四期重建用的特供凱門鱷（檢）",
    "第四期重建用的特供蚕茧（检）": "第四期重建用的特供蠶繭（檢）",
    "第四期重建用的特供冰笋（检）": "第四期重建用的特供冰筍（檢）",
    "第四期重建用的特供泥鳅（检）": "第四期重建用的特供泥鰍（檢）",
    "第四期重建用的特供雪虫（检）": "第四期重建用的特供雪蟲（檢）",
}

def main():
    # Output the known translations as JSON
    output_file = os.path.join(OUTPUT_DIR, "js", "data", "translations.js")

    js_content = f"""// CN to TC Translation Map for FF14 Items
// 簡繁中翻譯對照表

const TRANSLATIONS = {json.dumps(KNOWN_TRANSLATIONS, ensure_ascii=False, indent=2)};

// Translate function
function translateCN(text) {{
  return TRANSLATIONS[text] || text;
}}

// Export
if (typeof module !== 'undefined' && module.exports) {{
  module.exports = {{ TRANSLATIONS, translateCN }};
}}
"""

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(js_content)

    print(f"Translation file written to {output_file}")
    print(f"Total translations: {len(KNOWN_TRANSLATIONS)}")

if __name__ == "__main__":
    main()
