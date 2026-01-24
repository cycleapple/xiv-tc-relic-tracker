// 優武 (Eureka Weapons) - SB 4.0
// 禁地兵裝

const EUREKA_DATA = {
  id: 'eureka',
  name: '優武',
  fullName: '禁地兵裝',
  version: '4.0',
  description: '紅蓮的解放者的優雷卡武器系列',
  prerequisite: '需要70級職業裝進入優雷卡',
  stages: [
    {
      id: 'antiquated',
      name: '禁地兵裝',
      ilvl: 335,
      quest: '常風之地',
      materials: [
        {
          id: 'anemos_crystal',
          name: '亂屬性水晶',
          quantity: 100,
          source: '常風之地FATE/NM',
          note: '可在營地蓋羅爾特處將「常風水晶」分解為「亂屬性水晶」\n分解獲得數量隨機，一個個分解可以獲得更高期望（但是更累）'
        }
      ]
    },
    {
      id: 'anemos_1',
      name: '+1',
      ilvl: 340,
      materials: [
        {
          id: 'anemos_crystal_2',
          name: '亂屬性水晶',
          quantity: 400,
          source: '常風之地FATE/NM',
          note: '可在營地蓋羅爾特處將「常風水晶」分解為「亂屬性水晶」'
        }
      ]
    },
    {
      id: 'anemos_2',
      name: '+2',
      ilvl: 345,
      materials: [
        {
          id: 'anemos_crystal_3',
          name: '亂屬性水晶',
          quantity: 800,
          source: '常風之地FATE/NM',
          note: '可在營地蓋羅爾特處將「常風水晶」分解為「亂屬性水晶」'
        }
      ]
    },
    {
      id: 'anemos',
      name: '常風',
      ilvl: 355,
      materials: [
        {
          id: 'pazuzu_feather',
          name: '帕祖祖的羽毛',
          quantity: 3,
          source: 'NM掉落/亂屬性水晶 300兌換',
          note: '19級 NM「暴風魔王——帕祖祖」\n金牌可獲得3個\n可使用亂屬性水晶 ×300 兌換'
        }
      ]
    },
    {
      id: 'pagos',
      name: '恆冰',
      ilvl: 360,
      quest: '恆冰之地',
      description: 'ELv25後獲得優雷卡以太壺',
      materials: [
        { id: 'frosted_crystal', name: '結冰亂屬性水晶', quantity: 5, source: '恆冰之地' }
      ]
    },
    {
      id: 'pagos_1',
      name: '恆冰+1',
      ilvl: 365,
      materials: [
        { id: 'frosted_crystal_2', name: '結冰亂屬性水晶', quantity: 10, source: '恆冰之地' },
        {
          id: 'pagos_crystal',
          name: '恆冰水晶',
          quantity: 500,
          source: '恆冰之地NM',
          note: 'NM獲得'
        }
      ]
    },
    {
      id: 'elemental',
      name: '元素',
      ilvl: 370,
      materials: [
        { id: 'frosted_crystal_3', name: '結冰亂屬性水晶', quantity: 16, source: '恆冰之地' },
        {
          id: 'louhi_ice',
          name: '婁希的冰片',
          quantity: 5,
          source: 'NM掉落/恆冰水晶 50兌換',
          note: '34級 NM「蒼藍冰刃——婁希」\n金牌可獲得2個\n可使用恆冰水晶 ×50 兌換（調查隊的警衛員@營地內）'
        }
      ]
    },
    {
      id: 'elemental_1',
      name: '元素+1',
      ilvl: 375,
      quest: '涌火之地',
      description: '記錄文理技能10種',
      materials: [
        {
          id: 'pyros_crystal',
          name: '涌火水晶',
          quantity: 150,
          source: '涌火之地NM',
          note: 'NM獲得'
        },
        { id: 'logos_action_10', name: '記錄文理技能', quantity: 10, source: '收集文理技能' }
      ]
    },
    {
      id: 'elemental_2',
      name: '元素+2',
      ilvl: 380,
      description: '記錄文理技能20種',
      materials: [
        {
          id: 'pyros_crystal_2',
          name: '涌火水晶',
          quantity: 200,
          source: '涌火之地NM',
          note: 'NM獲得'
        },
        { id: 'logos_action_20', name: '記錄文理技能', quantity: 20, source: '收集文理技能' }
      ]
    },
    {
      id: 'pyros',
      name: '涌火',
      ilvl: 385,
      description: '記錄文理技能30種',
      materials: [
        {
          id: 'pyros_crystal_3',
          name: '涌火水晶',
          quantity: 300,
          source: '涌火之地NM',
          note: 'NM獲得'
        },
        {
          id: 'penthesilea_flame',
          name: '彭忒西勒亞的火種',
          quantity: 5,
          source: 'NM掉落/涌火水晶 50兌換',
          note: '49級 NM「炎蝶的女王——彭忒西勒亞」\n金牌可獲得3個\n可使用涌火水晶 ×50 兌換（調查隊的警衛員@營地內）'
        },
        { id: 'logos_action_30', name: '記錄文理技能', quantity: 30, source: '收集文理技能' }
      ]
    },
    {
      id: 'hydatos',
      name: '豐水',
      ilvl: 390,
      quest: '豐水之地',
      materials: [
        {
          id: 'hydatos_crystal',
          name: '豐水水晶',
          quantity: 50,
          source: '豐水之地NM',
          note: 'NM獲得'
        }
      ]
    },
    {
      id: 'hydatos_1',
      name: '豐水+1',
      ilvl: 395,
      materials: [
        {
          id: 'hydatos_crystal_2',
          name: '豐水水晶',
          quantity: 100,
          source: '豐水之地NM',
          note: 'NM獲得'
        }
      ]
    },
    {
      id: 'eureka',
      name: '優雷卡',
      ilvl: 405,
      materials: [
        {
          id: 'hydatos_crystal_3',
          name: '豐水水晶',
          quantity: 100,
          source: '豐水之地NM',
          note: 'NM獲得'
        },
        {
          id: 'crystalline_scale',
          name: '結晶龍鱗',
          quantity: 5,
          source: 'BA掉落',
          note: '59級 NM「水晶之龍——起源守望者」\n金牌可獲得3個'
        }
      ]
    },
    {
      id: 'physeos',
      name: '自然',
      ilvl: 405,
      description: '強化光效',
      materials: [
        { id: 'eureka_fragment', name: '優雷卡碎晶', quantity: 100, source: 'BA掉落' }
      ]
    }
  ]
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EUREKA_DATA;
}
