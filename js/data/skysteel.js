// 天鋼工具 (Skysteel Tools) - ShB 5.0
// 重建伊修加爾德 生產採集工具
// 資料來源：ffxiv-datamining-tc / ffxiv-datamining-cn
//
// 5.25: 天鋼+1（工票×20 + 普通A×20）、龍詩（工票×30 + 普通B×30）
// 5.35: 改良型龍詩（工票×18 + 普通A×36）、天詩（工票×21 + 普通B×21）
//   工票素材為收藏品，數量為最低需求（最高收藏價值時）
// 5.45: 天工（工票×20 + 空島A×100 + 空島B×100）

const SKYSTEEL_DATA = {
  id: 'skysteel',
  name: '天鋼',
  fullName: '天鋼工具',
  version: '5.0',
  description: '重建伊修加爾德的能工巧匠／大地使者專用工具強化系列',
  stages: [
    // ── Stage 1: 天鋼工具 iLv440 ──
    {
      id: 'skysteel',
      name: '天鋼工具',
      ilvl: 440,
      quest: '沉睡於工坊的陳舊工具',
      description: '與蒼天街的艾米尼對話獲得基礎工具，無需材料。',
      materials: null
    },

    // ── Stage 2: 天鋼工具+1 iLv455（5.25）──
    // 工票素材×20 + 普通素材A×20
    {
      id: 'skysteel_plus1',
      name: '天鋼工具+1',
      ilvl: 455,
      quest: '改良天鋼工具',
      description: '工票素材×20（巧手紫票兌換或市場購買）＋普通素材×20。',
      materials: {
        crafters: [
          { job: 'CRP', materials: [
            { name: '改良用的矽化木', quantity: 20 },
            { name: '白梣木原木', quantity: 20 }
          ]},
          { job: 'BSM', materials: [
            { name: '改良用的鐵砂', quantity: 20 },
            { name: '魔銀沙', quantity: 20 }
          ]},
          { job: 'ARM', materials: [
            { name: '改良用的鐵礦', quantity: 20 },
            { name: '魔銀沙', quantity: 20 }
          ]},
          { job: 'GSM', materials: [
            { name: '改良用的原石', quantity: 20 },
            { name: '魔銀沙', quantity: 20 }
          ]},
          { job: 'LTW', materials: [
            { name: '改良用的粗皮', quantity: 20 },
            { name: '野蠻盜龍的粗皮', quantity: 20 }
          ]},
          { job: 'WVR', materials: [
            { name: '改良用的棉花', quantity: 20 },
            { name: '仙子棉', quantity: 20 }
          ]},
          { job: 'ALC', materials: [
            { name: '改良用的石英', quantity: 20 },
            { name: '吸血藤的樹汁', quantity: 20 }
          ]},
          { job: 'CUL', materials: [
            { name: '改良用的種子', quantity: 20 },
            { name: '高地天然水', quantity: 20 }
          ]}
        ],
        gatherers: [
          { job: 'MIN', materials: [
            { name: '改良用的黑曜石', quantity: 340 },
            { name: '改良用的礦砂', quantity: 120 }
          ]},
          { job: 'BTN', materials: [
            { name: '改良用的乳膠', quantity: 340 },
            { name: '改良用的化石砂', quantity: 120 }
          ]},
          { job: 'FSH', materials: [
            { name: '智慧珊瑚', quantity: 40 }
          ]}
        ]
      }
    },

    // ── Stage 3: 龍詩工具 iLv475（5.25）──
    // 工票素材×30 + 普通素材B×30
    {
      id: 'dragonsung',
      name: '龍詩工具',
      ilvl: 475,
      quest: '改良天鋼工具',
      description: '工票素材×30（同天鋼+1的工票素材）＋普通素材×30。',
      materials: {
        crafters: [
          { job: 'CRP', materials: [
            { name: '改良用的矽化木', quantity: 30 },
            { name: '沙柚木木材', quantity: 30 }
          ]},
          { job: 'BSM', materials: [
            { name: '改良用的鐵砂', quantity: 30 },
            { name: '鈦銅錠', quantity: 30 }
          ]},
          { job: 'ARM', materials: [
            { name: '改良用的鐵礦', quantity: 30 },
            { name: '鈦銅錠', quantity: 30 }
          ]},
          { job: 'GSM', materials: [
            { name: '改良用的原石', quantity: 30 },
            { name: '凝灰岩磨刀石', quantity: 30 }
          ]},
          { job: 'LTW', materials: [
            { name: '改良用的粗皮', quantity: 30 },
            { name: '纏尾蛟革', quantity: 30 }
          ]},
          { job: 'WVR', materials: [
            { name: '改良用的棉花', quantity: 30 },
            { name: '力山羊毛布', quantity: 30 }
          ]},
          { job: 'ALC', materials: [
            { name: '改良用的石英', quantity: 30 },
            { name: '強泡鹼', quantity: 30 }
          ]},
          { job: 'CUL', materials: [
            { name: '改良用的種子', quantity: 30 },
            { name: '黑夜醋', quantity: 30 }
          ]}
        ],
        gatherers: [
          { job: 'MIN', materials: [
            { name: '改良用的黑暗物質', quantity: 510 },
            { name: '改良用的火種', quantity: 180 }
          ]},
          { job: 'BTN', materials: [
            { name: '改良用的琥珀', quantity: 510 },
            { name: '改良用的珍寶', quantity: 180 }
          ]},
          { job: 'FSH', materials: [
            { name: '龍骨貝', quantity: 60 }
          ]}
        ]
      }
    },

    // ── Stage 4: 改良型龍詩工具 iLv485（5.35）──
    // 工票素材×18（最低，依收藏價值）+ 普通素材A×36
    // 收藏品工票素材用巧手紫票或蒼天街振興票兌換
    {
      id: 'augmented_dragonsung',
      name: '改良型龍詩工具',
      ilvl: 485,
      quest: '改良工具的建議',
      description: '工票素材×18（最低，依收藏價值而定）＋普通素材×36。工票素材用巧手紫票或蒼天街振興票兌換。',
      materials: {
        crafters: [
          { job: 'CRP', materials: [
            { name: '改良用雪松原木', quantity: 18 },
            { name: '癒瘡木原木', quantity: 36 }
          ]},
          { job: 'BSM', materials: [
            { name: '改良用餅鐵礦', quantity: 18 },
            { name: '暗銀礦', quantity: 36 }
          ]},
          { job: 'ARM', materials: [
            { name: '改良用靈銀沙', quantity: 18 },
            { name: '暗銀礦', quantity: 36 }
          ]},
          { job: 'GSM', materials: [
            { name: '改良用銀礦', quantity: 18 },
            { name: '暗銀沙', quantity: 36 }
          ]},
          { job: 'LTW', materials: [
            { name: '改良用迦迦納怪鳥的粗皮', quantity: 18 },
            { name: '黃明礬', quantity: 36 }
          ]},
          { job: 'WVR', materials: [
            { name: '改良用綿羊毛', quantity: 18 },
            { name: '矮人棉', quantity: 36 }
          ]},
          { job: 'ALC', materials: [
            { name: '改良用樹液', quantity: 18 },
            { name: '吸血草杯的卷鬚', quantity: 36 }
          ]},
          { job: 'CUL', materials: [
            { name: '改良用蘆薈', quantity: 18 },
            { name: '油橄欖', quantity: 36 }
          ]}
        ],
        gatherers: [
          { job: 'MIN', materials: [
            { name: '改良用黑電氣石', quantity: 500 },
            { name: '改良用大地靈砂', quantity: 180 }
          ]},
          { job: 'BTN', materials: [
            { name: '改良用暗栗木原木', quantity: 500 },
            { name: '改良用大樹靈砂', quantity: 180 }
          ]},
          { job: 'FSH', materials: [
            { name: '梅花貝', quantity: 60 }
          ]}
        ]
      }
    },

    // ── Stage 5: 天詩工具 iLv500（5.35）──
    // 工票素材×21（最低）+ 普通素材B×21
    {
      id: 'skysung',
      name: '天詩工具',
      ilvl: 500,
      quest: '經過打磨的匠人工具',
      description: '工票素材×21（最低，依收藏價值而定）＋普通素材×21。同改良型龍詩的工票素材。',
      materials: {
        crafters: [
          { job: 'CRP', materials: [
            { name: '改良用雪松原木', quantity: 21 },
            { name: '癒瘡木木材', quantity: 21 }
          ]},
          { job: 'BSM', materials: [
            { name: '改良用餅鐵礦', quantity: 21 },
            { name: '矮人銀錠', quantity: 21 }
          ]},
          { job: 'ARM', materials: [
            { name: '改良用靈銀沙', quantity: 21 },
            { name: '矮人銀錠', quantity: 21 }
          ]},
          { job: 'GSM', materials: [
            { name: '改良用銀礦', quantity: 21 },
            { name: '矮人銀塊', quantity: 21 }
          ]},
          { job: 'LTW', materials: [
            { name: '改良用迦迦納怪鳥的粗皮', quantity: 21 },
            { name: '海燕革', quantity: 21 }
          ]},
          { job: 'WVR', materials: [
            { name: '改良用綿羊毛', quantity: 21 },
            { name: '矮人棉布', quantity: 21 }
          ]},
          { job: 'ALC', materials: [
            { name: '改良用樹液', quantity: 21 },
            { name: '強泡鹼', quantity: 21 }
          ]},
          { job: 'CUL', materials: [
            { name: '改良用蘆薈', quantity: 21 },
            { name: '黑夜醋', quantity: 21 }
          ]}
        ],
        gatherers: [
          { job: 'MIN', materials: [
            { name: '改良用古代礦石', quantity: 600 },
            { name: '改良用古代瀝青', quantity: 200 }
          ]},
          { job: 'BTN', materials: [
            { name: '改良用古代原木', quantity: 600 },
            { name: '改良用古代樹脂', quantity: 200 }
          ]},
          { job: 'FSH', materials: [
            { name: '亞拉戈獵手', quantity: 70 }
          ]}
        ]
      }
    },

    // ── Stage 6: 天工工具 iLv510（5.45 最終階段）──
    // 工票素材×20（巧手紫票或蒼天街振興票兌換）+ 空島素材A×100 + 空島素材B×100
    // 此階段收藏品製作為高難度配方
    {
      id: 'skybuilders',
      name: '天工工具',
      ilvl: 510,
      quest: '日漸完善的匠人工具',
      description: '工票素材×20＋蒼天街空島素材各×100。工票素材用巧手紫票或蒼天街振興票兌換，此階段為高難度配方。',
      materials: {
        crafters: [
          { job: 'CRP', materials: [
            { name: '最終改良用松木原木', quantity: 20 },
            { name: '第四期重建用的特供原木（檢）', quantity: 100 },
            { name: '第四期重建用的特供木賊草（檢）', quantity: 100 }
          ]},
          { job: 'BSM', materials: [
            { name: '最終改良用清銀礦', quantity: 20 },
            { name: '第四期重建用的特供礦石（檢）', quantity: 100 },
            { name: '第四期重建用的特供矽砂（檢）', quantity: 100 }
          ]},
          { job: 'ARM', materials: [
            { name: '最終改良用白鎢礦', quantity: 20 },
            { name: '第四期重建用的特供礦石（檢）', quantity: 100 },
            { name: '第四期重建用的特供彩虹晶（檢）', quantity: 100 }
          ]},
          { job: 'GSM', materials: [
            { name: '最終改良用蒼天石原石', quantity: 20 },
            { name: '第四期重建用的特供矽砂（檢）', quantity: 100 },
            { name: '第四期重建用的特供木賊草（檢）', quantity: 100 }
          ]},
          { job: 'LTW', materials: [
            { name: '最終改良用瞪羚的粗皮', quantity: 20 },
            { name: '第四期重建用的特供原木（檢）', quantity: 100 },
            { name: '第四期重建用的特供凱門鱷（檢）', quantity: 100 }
          ]},
          { job: 'WVR', materials: [
            { name: '最終改良用苧麻', quantity: 20 },
            { name: '第四期重建用的特供蠶繭（檢）', quantity: 100 },
            { name: '第四期重建用的特供冰筍（檢）', quantity: 100 }
          ]},
          { job: 'ALC', materials: [
            { name: '最終改良用槲寄生', quantity: 20 },
            { name: '第四期重建用的特供天然水（檢）', quantity: 100 },
            { name: '第四期重建用的特供蔓越莓（檢）', quantity: 100 }
          ]},
          { job: 'CUL', materials: [
            { name: '最終改良用錘頭鯊', quantity: 20 },
            { name: '第四期重建用的特供天然水（檢）', quantity: 100 },
            { name: '第四期重建用的特供冰筍（檢）', quantity: 100 }
          ]}
        ],
        gatherers: [
          { job: 'MIN', materials: [
            { name: '採掘工具最終改良用零件', quantity: 250 },
            { name: '採掘工具最終改良用輔助零件', quantity: 25 }
          ]},
          { job: 'BTN', materials: [
            { name: '園藝工具最終改良用零件', quantity: 250 },
            { name: '園藝工具最終改良用輔助零件', quantity: 25 }
          ]},
          { job: 'FSH', materials: [
            { name: '捕魚用具長杆的最終改良用零件', quantity: 200 },
            { name: '捕魚用具繞線輪的最終改良用零件', quantity: 200 }
          ]}
        ]
      }
    }
  ]
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SKYSTEEL_DATA;
}
