// 古武 (Zodiac Weapons) - ARR 2.0
// 黃道十二武器

const ZODIAC_DATA = {
  id: 'zodiac',
  name: '古武',
  fullName: '黃道武器',
  version: '2.0',
  description: '新生艾奧澤亞的上古武器系列',
  stages: [
    {
      id: 'relic_base',
      name: '古武+0',
      ilvl: 80,
      quest: '復甦的上古武器',
      materials: [
        {
          id: 'prototype_weapon',
          name: '原型武器（鑲嵌魔晶石）',
          quantity: 1,
          source: '製作/市場購買',
          note: '騎士：神風彎刀（剛柔參）\n戰士：野蠻巨斧（剛柔參）\n武僧：野性鋼拳（武略參）\n龍騎：冠軍騎槍（武略參）\n黑魔：染血咒杖（雄略參）\n白魔：狂人低語（詠唱參）\n詩人：長臂複合弓（神眼參）\n召喚：博學詠咒巫書（雄略參）\n學者：博學治癒巫書（詠唱參）\n忍者：吸血匕首（神眼參）'
        },
        {
          id: 'thavnairian_mist',
          name: '拉札罕淬火油',
          quantity: 1,
          source: '詩學 15',
          tomestone: 15,
          note: '三主城、伊修加德、摩杜納、田園郡詩學商人均可兌換，分類選《特殊武器相關》（未接任務亦可兌換）'
        }
      ]
    },
    {
      id: 'zenith',
      name: '古武+1 天極',
      ilvl: 90,
      quest: '攜帶古武和薩維奈靈藥，在冶煉爐處兌換升級',
      materials: [
        {
          id: 'thavnairian_mist_2',
          name: '薩維奈靈藥',
          quantity: 3,
          source: '詩學 20×3',
          tomestone: 60,
          note: '三主城、伊修加德、摩杜納、田園郡詩學商人均可兌換，分類選《特殊武器相關》（未接任務亦可兌換）'
        }
      ]
    },
    {
      id: 'atma',
      name: '古武+1.5 魂晶',
      ilvl: 100,
      quest: '尋找英雄的武器',
      description: '在各地圖刷FATE獲得十二魂晶（推薦用計時器網站追蹤）',
      materials: [
        {
          id: 'atma_crystal',
          name: '十二魂晶',
          quantity: 1,
          source: '各地圖FATE掉落',
          note: '摩羯座：東部林區\n水瓶座：拉諾西亞高地\n雙魚座：拉諾西亞低地\n白羊座：中央拉諾西亞\n金牛座：東薩納蘭\n雙子座：西薩納蘭\n巨蟹座：西拉諾西亞\n獅子座：拉諾西亞外地\n處女座：中央林區\n天秤座：中央薩納蘭\n天蠍座：南薩納蘭\n射手座：北部林區'
        }
      ]
    },
    {
      id: 'animus',
      name: '古武+2 魂靈',
      ilvl: 100,
      quest: '黃道文書',
      description: '從古・茱薩奈（摩杜納 X:22.9, Y:7.3）購買黃道書，完成指定副本',
      materials: [
        { id: 'book_skyfire1', name: '水天文書‧第一卷', quantity: 1, source: '詩學 100', tomestone: 100, note: '接「滴水之恩」，重合澤梅爾要塞和50動物園' },
        { id: 'book_skyfire2', name: '風天文書‧第一卷', quantity: 1, source: '詩學 100', tomestone: 100, note: '接「挑戰未知的工匠」，先打黃金谷再打修煉所' },
        { id: 'book_skyfall1', name: '水天文書‧第二卷', quantity: 1, source: '詩學 100', tomestone: 100, note: '接「慈母手中物」，打無限城和靜語莊園' },
        { id: 'book_skyfall2', name: '水獄文書‧第一卷', quantity: 1, source: '詩學 100', tomestone: 100, note: '慈母手中物剩兩個不重合的墓園和石衛塔' },
        { id: 'book_netherfire1', name: '火天文書‧第一卷', quantity: 1, source: '詩學 100', tomestone: 100, note: '挑戰未知的工匠剩一個不重合的溶洞' },
        { id: 'book_netherfire2', name: '火天文書‧第二卷', quantity: 1, source: '詩學 100', tomestone: 100, note: '先打神靈聖域，然後交「激情與夢想」第一步，再打騷亂坑道' },
        { id: 'book_netherfall1', name: '火獄文書‧第一卷', quantity: 1, source: '詩學 100', tomestone: 100 },
        { id: 'book_netherfall2', name: '土天文書‧第一卷', quantity: 1, source: '詩學 100', tomestone: 100 },
        { id: 'book_skyearth', name: '風天文書‧第二卷', quantity: 1, source: '詩學 100', tomestone: 100 }
      ]
    },
    {
      id: 'novus',
      name: '古武+3 新星',
      ilvl: 110,
      quest: '天球的光芒 / 新星璀璨',
      materials: [
        {
          id: 'superior_ink',
          name: '高位附魔墨水',
          quantity: 3,
          source: '詩學 25×3',
          tomestone: 75,
          note: '三主城、伊修加德、摩杜納、田園郡詩學商人均可兌換，分類選《特殊武器相關》（未接任務亦可兌換）'
        },
        {
          id: 'alexandrite',
          name: '星光變石',
          quantity: 75,
          source: '神秘地圖/詩學 75/同盟徽章 50',
          note: '1）布蘭格維茵（摩杜納 X:22, Y:6.7）接《神秘地圖》，打50/60隨機任務獲得地圖，解讀後開箱獲得5塊\n2）摩杜納可用75詩學換神秘地圖\n3）大國防聯軍可用50同盟徽章換星光變石'
        },
        {
          id: 'materia',
          name: '魔晶石',
          quantity: 75,
          source: '市場購買',
          note: '選便宜的！從一型開始打！最多打5種！'
        }
      ]
    },
    {
      id: 'nexus',
      name: '古武+4 連結',
      ilvl: 115,
      quest: '靈魂共鳴',
      description: '刷光（副本、FATE等累積2000點）',
      materials: [
        { id: 'light', name: '刷光', quantity: 1, source: '副本/FATE累積2000點' }
      ]
    },
    {
      id: 'zodiac_braves',
      name: '古武+5 黃道',
      ilvl: 125,
      quest: '踏上黃道的征途',
      description: '需完成4個支線任務：滴水之恩、挑戰未知的工匠、慈母手中物、激情與夢想',
      materials: [
        { id: 'bombard_core', name: '大炎獸核心', quantity: 4, source: '軍票 20000×4', note: '軍票商人購買，共需 80000 軍票' },
        { id: 'sacred_spring_water', name: '靈峰泉水', quantity: 4, source: '詩學 200×4', tomestone: 800, note: '詩學商人兌換' },
        {
          id: 'perfect_mortar',
          name: '石綠湖水晶',
          quantity: 1,
          source: '雜用商人 100000G',
          note: '船頭雜用商人 拉諾西亞高地 (X:26.1, Y:26.4)'
        },
        {
          id: 'allagan_resin',
          name: '亞拉戈樹脂',
          quantity: 1,
          source: '雜用商人 100000G',
          note: '遺忘綠洲雜用商人 南薩納蘭 (X:15.9, Y:29.1)'
        },
        {
          id: 'brass_kettle',
          name: '黃銅壺',
          quantity: 1,
          source: '雜用商人 100000G',
          note: '和平苑雜用商人 黑衣森林北部林區 (X:29.9, Y:18.9)'
        },
        {
          id: 'war_god_sand',
          name: '戰神砂',
          quantity: 1,
          source: '雜用商人 100000G',
          note: '白雲崖雜用商人 庫爾札斯中央高地 (X:13.3, Y:16)'
        },
        { id: 'fire_ring', name: '熔火指環HQ', quantity: 1, source: '製作或購買', note: '雕金匠製作' },
        { id: 'firewood', name: '高品質的木柴HQ', quantity: 1, source: '製作或購買', note: '刻木匠製作' },
        { id: 'mortar', name: '高品質的研缽HQ', quantity: 1, source: '製作或購買', note: '鍛鐵匠製作' },
        { id: 'pestle', name: '高品質的缽杵HQ', quantity: 1, source: '製作或購買', note: '木工製作' },
        { id: 'eel_pie', name: '秘製鰻魚派HQ', quantity: 1, source: '製作或購買', note: '烹調師製作' },
        { id: 'cloth', name: '高品質的古布料HQ', quantity: 1, source: '製作或購買', note: '裁縫師製作' },
        { id: 'parchment', name: '高品質的羊皮紙HQ', quantity: 1, source: '製作或購買', note: '煉金術士製作' },
        { id: 'powder', name: '高品質的安定粉HQ', quantity: 1, source: '製作或購買', note: '煉金術士製作' }
      ]
    },
    {
      id: 'zeta',
      name: '古武+6 本我',
      ilvl: 135,
      quest: '力量覺醒',
      description: '攜帶古武+5前往雷蒙（西拉諾西亞 X:34.3, Y:31.7）領取聖魂刷光',
      materials: [
        { id: 'light', name: '刷光', quantity: 1, source: '詩學 600', tomestone: 600, note: '推薦：黃金谷' }
      ]
    }
  ]
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ZODIAC_DATA;
}
