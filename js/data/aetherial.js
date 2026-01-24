// 幻武 (Aetherial Weapons) - DT 7.0
// 幻境武器

const AETHERIAL_DATA = {
  id: 'aetherial',
  name: '幻武',
  fullName: '幻境武器',
  version: '7.0',
  description: '黃金遺產的幻境武器系列',
  prerequisite: '需完成主線任務「柯坦拉姆最後的冒險」',
  stages: [
    {
      id: 'penumbral',
      name: '半影',
      ilvl: 745,
      quest: '幻境中的武器',
      description: '多多庫利（幻境村 6.7, 7.1）',
      materials: [
        {
          id: 'crescent_moonstone',
          name: '新月礦石',
          quantity: 3,
          source: '天道 500×3',
          tomestone: 1500,
          note: '爾密娜（幻境村 X:6.9, Y:7.3）\n幻境村、無限境、拉札罕、摩杜納詩學商人均可兌換\n分類選《特殊武器相關》'
        }
      ]
    },
    {
      id: 'umbral',
      name: '本影',
      ilvl: 760,
      description: '多多庫利（幻境村 6.7, 7.1）',
      materials: [
        {
          id: 'halfmoon_stone',
          name: '上弦月礦石',
          quantity: 3,
          source: '天道 500×3',
          tomestone: 1500,
          note: '爾密娜（幻境村 X:6.9, Y:7.3）\n幻境村、無限境、拉札罕、摩杜納詩學商人均可兌換\n分類選《特殊武器相關》'
        }
      ]
    }
  ],
  // 前置收集（全職業共用）
  prerequisiteMaterials: [
    {
      id: 'soul_crystals',
      name: '半魂晶收集',
      description: '島內CE掉率20%，FATE掉率5%',
      materials: [
        {
          id: 'cyan_semisolid',
          name: '青色半魂晶',
          quantity: 3,
          source: '新月島CE/FATE',
          note: '奧闊帕恰山 FATE概率獲得\n新月島 CE概率較高（約20%）\n刷完一色後可繼續刷下一色'
        },
        {
          id: 'turquoise_semisolid',
          name: '碧色半魂晶',
          quantity: 3,
          source: '新月島CE/FATE',
          note: '克扎瑪烏卡濕地 FATE概率獲得\n新月島 CE概率較高（約20%）'
        },
        {
          id: 'green_semisolid',
          name: '綠色半魂晶',
          quantity: 3,
          source: '新月島CE/FATE',
          note: '薩納蘭幻野 FATE概率獲得\n新月島 CE概率較高（約20%）'
        },
        {
          id: 'orange_semisolid',
          name: '橙色半魂晶',
          quantity: 3,
          source: '新月島CE/FATE',
          note: 'YaK T\'el FATE概率獲得\n新月島 CE概率較高（約20%）'
        },
        {
          id: 'purple_semisolid',
          name: '紫色半魂晶',
          quantity: 3,
          source: '新月島CE/FATE',
          note: '遺產流沙 FATE概率獲得\n新月島 CE概率較高（約20%）'
        },
        {
          id: 'yellow_semisolid',
          name: '黃色半魂晶',
          quantity: 3,
          source: '新月島CE/FATE',
          note: '活力平原 FATE概率獲得\n新月島 CE概率較高（約20%）'
        }
      ]
    },
    {
      id: 'craft_materials',
      name: '古代工匠的技術',
      description: '與NPC對話時需要提交以下材料',
      materials: [
        {
          id: 'bison_glue',
          name: '犎牛膠',
          quantity: 1,
          source: '金幣 300000',
          note: '幻境村素材商人（X:6.8, Y:6.5）購買\n需30萬金幣'
        },
        {
          id: 'ut_uhm_iron',
          name: '烏托姆隕鐵',
          quantity: 1,
          source: '雙色寶石 600',
          note: '雙色寶石兌換\n各主城軍票商人、摩杜納寶石商人可兌換'
        },
        {
          id: 'dark_matter_a',
          name: '人造暗物質α',
          quantity: 1,
          source: '製作或購買',
          note: '鍛鐵/雕金/甲胄/製革職業製作\n也可在市場購買'
        },
        {
          id: 'dark_matter_b',
          name: '人造暗物質β',
          quantity: 1,
          source: '製作或購買',
          note: '裁縫/鍊金職業製作\n也可在市場購買'
        },
        {
          id: 'dark_matter_g',
          name: '人造暗物質γ',
          quantity: 1,
          source: '製作或購買',
          note: '木工/烹調職業製作\n也可在市場購買'
        }
      ]
    },
    {
      id: 'light_farming',
      name: '蘊藏屬性之力的魔法球',
      description: '點擊任務道具圖標可打開魔球盤',
      materials: [
        {
          id: 'light_points',
          name: '刷光',
          quantity: 10000,
          source: '各10000點（推薦每日隨機）',
          note: '六種屬性各需10000點\n推薦方式：\n1. 每日隨機（練級/50/60/70/專家）\n2. 新月島FATE/CE\n3. 副本刷光\n每日隨機首次通關獎勵最高'
        }
      ]
    }
  ]
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AETHERIAL_DATA;
}
