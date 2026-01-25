// 魂武 (Anima Weapons) - HW 3.0
// 元靈武器

const ANIMA_DATA = {
  id: 'anima',
  name: '魂武',
  fullName: '元靈武器',
  version: '3.0',
  description: '蒼天的伊修加爾德的元靈武器系列',
  prerequisite: '前置任務：其名元靈武器',
  stages: [
    {
      id: 'animated',
      name: '元靈+0 創造',
      ilvl: 170,
      quest: '創造新武器',
      description: '摩杜納 (X:23, Y:6) 2樓露台',
      materials: [
        {
          id: 'astral_nodule',
          name: '星極水晶',
          quantity: 1,
          source: '古武+6兌換/FATE',
          note: '推薦使用古武+6兌換獲得'
        },
        {
          id: 'umbral_nodule',
          name: '靈極水晶',
          quantity: 1,
          source: '古武+6兌換/FATE',
          note: '推薦使用古武+6兌換獲得'
        },
        {
          id: 'luminous_fire_wind_lightning',
          name: '流光之火/風/雷水晶',
          quantity: 1,
          source: 'FATE',
          note: '火：魔大陸阿濟茲拉\n風：阿巴拉提亞雲海\n雷：翻雲霧海'
        },
        {
          id: 'luminous_ice_earth_water',
          name: '流光之冰/土/水水晶',
          quantity: 1,
          source: 'FATE',
          note: '冰：庫爾札斯西部高地\n土：龍堡參天高地\n水：龍堡內陸低地'
        }
      ]
    },
    {
      id: 'awoken',
      name: '元靈+1 覺醒',
      ilvl: 200,
      quest: '英雄的軌跡',
      materials: [
        { id: 'dungeon_clear', name: '副本十連', quantity: 1, source: '通關10個指定副本' }
      ]
    },
    {
      id: 'hyperconductive',
      name: '元靈+2 新元靈',
      ilvl: 210,
      quest: '閃耀的元靈武器',
      materials: [
        {
          id: 'enchanted_rubber',
          name: '附魔橡膠',
          quantity: 4,
          source: '合成',
          note: '需要：神秘骨片×10（詩學兌換）+ 精金投斧×4（軍票5000/製作/市場）',
          subMaterials: [
            { id: 'unidentified_bone', name: '神秘骨片', quantity: 10, source: '詩學 150', tomestone: 150 },
            { id: 'adamantite_francesca', name: '精金投斧', quantity: 4, source: '軍票 5000/製作/市場' }
          ]
        },
        {
          id: 'fast_drying_carboncoat',
          name: '亞拉戈上級硬化藥',
          quantity: 4,
          source: '合成',
          note: '需要：神秘貝殼×10（詩學兌換）+ 鈦合金鏡×4（軍票5000/製作/市場）',
          subMaterials: [
            { id: 'unidentified_shell', name: '神秘貝殼', quantity: 10, source: '詩學 150', tomestone: 150 },
            { id: 'titanium_alloy_mirror', name: '鈦合金鏡', quantity: 4, source: '軍票 5000/製作/市場' }
          ]
        },
        {
          id: 'fast_acting_allagan_catalyst',
          name: '亞拉戈上級魔觸媒',
          quantity: 4,
          source: '合成',
          note: '需要：神秘種子×10（詩學兌換）+ 國王餅×4（軍票5000/製作/市場）',
          subMaterials: [
            { id: 'unidentified_seeds', name: '神秘種子', quantity: 10, source: '詩學 150', tomestone: 150 },
            { id: 'kingcake', name: '國王餅', quantity: 4, source: '軍票 5000/製作/市場' }
          ]
        },
        {
          id: 'holy_water',
          name: '神聖水',
          quantity: 4,
          source: '合成',
          note: '需要：神秘原石×10（詩學兌換）+ 破魔箭×4（軍票5000/製作/市場）',
          subMaterials: [
            { id: 'unidentified_ore', name: '神秘原石', quantity: 10, source: '詩學 150', tomestone: 150 },
            { id: 'dispelling_arrow', name: '破魔箭', quantity: 4, source: '軍票 5000/製作/市場' }
          ]
        }
      ]
    },
    {
      id: 'reconditioned',
      name: '元靈+3 超導',
      ilvl: 230,
      quest: '人造元靈的聲音',
      materials: [
        {
          id: 'aether_oil',
          name: '亞拉戈絕靈油',
          quantity: 5,
          source: '詩學 350×5',
          tomestone: 1750,
          note: '詩學兌換'
        }
      ]
    },
    {
      id: 'sharpened',
      name: '元靈+4 再生',
      ilvl: 240,
      quest: '培育人造元靈',
      description: '烏蘭 田園郡 (X:6, Y:5)',
      materials: [
        {
          id: 'umbrite',
          name: '硬靈性岩',
          quantity: 60,
          source: '詩學 75×60',
          tomestone: 4500,
          note: '三主城、伊修加德、摩杜納、田園郡詩學商人均可兌換，分類選《特殊武器相關》（未接任務亦可兌換）'
        },
        {
          id: 'crystal_sand',
          name: '水晶砂',
          quantity: 60,
          source: '詩學/軍票 10000/多種素材交換',
          tomestone: 4750,
          optional: true,
          note: '⭐ 推薦使用免費方式獲得\n【免費方式】\n• 採集紫票兌換（推薦海釣）\n• 蠻神極掉落素材兌換\n• 半魔晶石分解\n【付費方式】\n• 詩學：約4,750（高位附魔墨水等）\n• 軍票：600,000（月長石×30，需協尉軍銜）'
        }
      ]
    },
    {
      id: 'complete',
      name: '元靈+5 靈慧',
      ilvl: 260,
      quest: '人造元靈的未來',
      materials: [
        {
          id: 'singing_cluster',
          name: '活性化晶簇',
          quantity: 50,
          source: '詩學 40×50/每週任務',
          tomestone: 2000,
          optional: true,
          note: '⭐ 可透過每週任務免費獲得\n詩學兌換：40×50 = 2,000\n任務「安費莉絲的委託」（田園）：每週給18個\n任務「安格萊特的委託」（田園）：每天給1個'
        }
      ]
    },
    {
      id: 'bloom',
      name: '元靈+5.5 終綻',
      ilvl: 270,
      quest: '人造元靈終綻放',
      materials: [
        {
          id: 'pneumite',
          name: '晶化氣體',
          quantity: 15,
          source: '詩學 100×15/軍票 4000/A9s',
          tomestone: 1500,
          optional: true,
          note: '⭐ 推薦刷副本免費獲得\n詩學兌換：100×15 = 1,500\n軍票兌換：4000×15 = 60,000\n推薦A9s（亞歷山大零式機神城 天動之章 1）'
        },
        {
          id: 'light_farming',
          name: '刷光（以太凝聚度）',
          quantity: 2000,
          source: '副本刷光',
          note: '需累積2000點以太凝聚度'
        },
        {
          id: 'dungeon_3',
          name: '完成3個迷宮',
          quantity: 1,
          source: '副本',
          note: '完成指定的3個副本'
        }
      ]
    },
    {
      id: 'lux',
      name: '元靈+6 光輝',
      ilvl: 275,
      quest: '誕生的瞬間',
      materials: [
        {
          id: 'archaic_ink',
          name: '古代附魔墨水',
          quantity: 1,
          source: '詩學 500',
          tomestone: 500,
          note: '未接任務無法兌換'
        },
        {
          id: 'primal_battles',
          name: '蠻神討伐',
          quantity: 12,
          source: '蠻神戰',
          note: '完成12場指定蠻神討伐戰'
        }
      ]
    }
  ]
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ANIMA_DATA;
}
