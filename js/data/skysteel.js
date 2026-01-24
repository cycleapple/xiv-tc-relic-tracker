// 天鋼工具 (Skysteel Tools)
// 生產採集職業發光工具

const SKYSTEEL_DATA = {
  id: 'skysteel',
  name: '天鋼工具',
  fullName: '天鋼工具',
  version: '5.0',
  description: '伊修加德重建的生產採集工具系列',
  prerequisite: '需完成伊修加德重建系列任務',
  stages: [
    {
      id: 'skysteel_base',
      name: '天鋼工具',
      quest: '沉睡於工房的陳舊工具',
      description: '德尼斯（天鋼機工房：伊修加德基礎層 X:8, Y:10.1）\n第二把開始可直接購買'
    },
    {
      id: 'skysteel_1',
      name: '天鋼工具+1',
      description: '使用「改良用」素材升級\n改良用素材可在伊修加德重建「蒼天街」獲得',
      materials: {
        crafters: [
          { job: 'CRP', materials: [{ name: '改良用的矽化木', quantity: 20, note: '蒼天街重建獲得' }, { name: '白梣木原木', quantity: 20, note: '黑衣森林東/南部林區伐木' }] },
          { job: 'BSM', materials: [{ name: '改良用的鐵砂', quantity: 20, note: '蒼天街重建獲得' }, { name: '魔銀砂', quantity: 20, note: '摩杜納採礦' }] },
          { job: 'ARM', materials: [{ name: '改良用的鐵礦', quantity: 20, note: '蒼天街重建獲得' }, { name: '魔銀砂', quantity: 20, note: '摩杜納採礦' }] },
          { job: 'GSM', materials: [{ name: '改良用的原石', quantity: 20, note: '蒼天街重建獲得' }, { name: '魔銀砂', quantity: 20, note: '摩杜納採礦' }] },
          { job: 'LTW', materials: [{ name: '改良用的粗皮', quantity: 20, note: '蒼天街重建獲得' }, { name: '野蠻盜龍的粗皮', quantity: 20, note: '翻雲霧海剝皮' }] },
          { job: 'WVR', materials: [{ name: '改良用的棉花', quantity: 20, note: '蒼天街重建獲得' }, { name: '仙子棉', quantity: 20, note: '阿巴拉提亞雲海採集' }] },
          { job: 'ALC', materials: [{ name: '改良用的岩鹽', quantity: 20, note: '蒼天街重建獲得' }, { name: '精金沙', quantity: 20, note: '摩杜納採礦' }] },
          { job: 'CUL', materials: [{ name: '改良用的小麥', quantity: 20, note: '蒼天街重建獲得' }, { name: '高嶺胡蘿蔔', quantity: 20, note: '龍堡參天高地採集' }] }
        ],
        gatherers: [
          { job: 'MIN', materials: [{ name: '改良用的原石', quantity: 20, note: '蒼天街重建獲得' }, { name: '魔銀砂', quantity: 20, note: '摩杜納採礦' }] },
          { job: 'BTN', materials: [{ name: '改良用的矽化木', quantity: 20, note: '蒼天街重建獲得' }, { name: '白梣木原木', quantity: 20, note: '黑衣森林東/南部林區伐木' }] },
          { job: 'FSH', materials: [{ name: '天鋼釣鉤', quantity: 10, note: '蒼天街釣魚獲得' }, { name: '天鋼重鉤', quantity: 10, note: '蒼天街刺魚獲得' }] }
        ]
      }
    },
    {
      id: 'dragonsung',
      name: '龍詩工具',
      description: '改良用素材數量增加\n需要更高級的中間素材',
      materials: {
        crafters: [
          { job: 'CRP', materials: [{ name: '改良用的矽化木', quantity: 30 }, { name: '沙柚木木材', quantity: 30, note: '製作' }] },
          { job: 'BSM', materials: [{ name: '改良用的鐵砂', quantity: 30 }, { name: '鈦銅錠', quantity: 30, note: '製作' }] },
          { job: 'ARM', materials: [{ name: '改良用的鐵礦', quantity: 30 }, { name: '鈦銅錠', quantity: 30, note: '製作' }] },
          { job: 'GSM', materials: [{ name: '改良用的原石', quantity: 30 }, { name: '凝灰岩磨刀石', quantity: 30, note: '製作' }] },
          { job: 'LTW', materials: [{ name: '改良用的粗皮', quantity: 30 }, { name: '纏尾蛟革', quantity: 30, note: '製作' }] },
          { job: 'WVR', materials: [{ name: '改良用的棉花', quantity: 30 }, { name: '力山羊毛布', quantity: 30, note: '製作' }] },
          { job: 'ALC', materials: [{ name: '改良用的岩鹽', quantity: 30 }, { name: '白金錠', quantity: 30, note: '製作' }] },
          { job: 'CUL', materials: [{ name: '改良用的小麥', quantity: 30 }, { name: '矮人麵包', quantity: 30, note: '製作' }] }
        ],
        gatherers: [
          { job: 'MIN', materials: [{ name: '改良用的原石', quantity: 30 }, { name: '凝灰岩磨刀石', quantity: 30, note: '製作' }] },
          { job: 'BTN', materials: [{ name: '改良用的矽化木', quantity: 30 }, { name: '沙柚木木材', quantity: 30, note: '製作' }] },
          { job: 'FSH', materials: [{ name: '龍詩釣鉤', quantity: 15, note: '蒼天街釣魚獲得' }, { name: '龍詩重鉤', quantity: 15, note: '蒼天街刺魚獲得' }] }
        ]
      }
    },
    {
      id: 'augmented_dragonsung',
      name: '改良型龍詩工具',
      quest: '改良工具的建議',
      description: '德尼斯處兌換改良用零件\n妮米（蒼天街 X:11.1, Y:14.4）兌換工具',
      materials: {
        crafters: [
          { job: 'CRP', materials: [{ name: '改良用雪松原木', quantity: 18, note: '蒼天街重建獲得' }, { name: '癒瘡木原木', quantity: 36, note: '伊爾美格伐木' }] },
          { job: 'BSM', materials: [{ name: '改良用餅鐵礦', quantity: 18, note: '蒼天街重建獲得' }, { name: '暗銀礦', quantity: 36, note: '珂露西亞島採礦' }] },
          { job: 'ARM', materials: [{ name: '改良用靈銀砂', quantity: 18, note: '蒼天街重建獲得' }, { name: '暗銀礦', quantity: 36, note: '珂露西亞島採礦' }] },
          { job: 'GSM', materials: [{ name: '改良用銀礦', quantity: 18, note: '蒼天街重建獲得' }, { name: '暗銀砂', quantity: 36, note: '珂露西亞島採礦' }] },
          { job: 'LTW', materials: [{ name: '改良用迦迦納怪鳥的粗皮', quantity: 18, note: '蒼天街重建獲得' }, { name: '黃明礬', quantity: 36, note: '拉凱提卡大森林採集' }] },
          { job: 'WVR', materials: [{ name: '改良用綿羊毛', quantity: 18, note: '蒼天街重建獲得' }, { name: '矮人棉', quantity: 36, note: '伊爾美格採集' }] },
          { job: 'ALC', materials: [{ name: '改良用天然水', quantity: 18, note: '蒼天街重建獲得' }, { name: '暗銀砂', quantity: 36, note: '珂露西亞島採礦' }] },
          { job: 'CUL', materials: [{ name: '改良用甜菜', quantity: 18, note: '蒼天街重建獲得' }, { name: '矮人麵粉', quantity: 36, note: '製作' }] }
        ],
        gatherers: [
          { job: 'MIN', materials: [{ name: '改良用銀礦', quantity: 18, note: '蒼天街重建獲得' }, { name: '暗銀砂', quantity: 36, note: '珂露西亞島採礦' }] },
          { job: 'BTN', materials: [{ name: '改良用雪松原木', quantity: 18, note: '蒼天街重建獲得' }, { name: '癒瘡木原木', quantity: 36, note: '伊爾美格伐木' }] },
          { job: 'FSH', materials: [{ name: '改良用飛蛆', quantity: 36, note: '蒼天街釣魚獲得' }, { name: '改良用蠕蟲', quantity: 72, note: '蒼天街刺魚獲得' }] }
        ]
      }
    },
    {
      id: 'skysung',
      name: '天詩工具',
      quest: '經過打磨的匠人工具',
      description: '德尼斯處兌換精密零件\n妮米（蒼天街 X:11.1, Y:14.4）兌換工具',
      materials: {
        crafters: [
          { job: 'CRP', materials: [{ name: '改良用雪松原木', quantity: 21 }, { name: '癒瘡木木材', quantity: 21, note: '製作' }] },
          { job: 'BSM', materials: [{ name: '改良用餅鐵礦', quantity: 21 }, { name: '矮人銀錠', quantity: 21, note: '製作' }] },
          { job: 'ARM', materials: [{ name: '改良用靈銀砂', quantity: 21 }, { name: '矮人銀錠', quantity: 21, note: '製作' }] },
          { job: 'GSM', materials: [{ name: '改良用銀礦', quantity: 21 }, { name: '矮人銀塊', quantity: 21, note: '製作' }] },
          { job: 'LTW', materials: [{ name: '改良用迦迦納怪鳥的粗皮', quantity: 21 }, { name: '海燕革', quantity: 21, note: '製作' }] },
          { job: 'WVR', materials: [{ name: '改良用綿羊毛', quantity: 21 }, { name: '矮人棉布', quantity: 21, note: '製作' }] },
          { job: 'ALC', materials: [{ name: '改良用天然水', quantity: 21 }, { name: '矮人銀塊', quantity: 21, note: '製作' }] },
          { job: 'CUL', materials: [{ name: '改良用甜菜', quantity: 21 }, { name: '矮人棉布', quantity: 21, note: '製作' }] }
        ],
        gatherers: [
          { job: 'MIN', materials: [{ name: '改良用銀礦', quantity: 21 }, { name: '矮人銀塊', quantity: 21, note: '製作' }] },
          { job: 'BTN', materials: [{ name: '改良用雪松原木', quantity: 21 }, { name: '癒瘡木木材', quantity: 21, note: '製作' }] },
          { job: 'FSH', materials: [{ name: '改良用飛蛆', quantity: 42 }, { name: '改良用蠕蟲', quantity: 84 }] }
        ]
      }
    },
    {
      id: 'skybuilders',
      name: '天工工具',
      quest: '改良工具的最終階段',
      description: '埃米尼（蒼天街 X:12.2, Y:14.6）處兌換\n使用「最終改良用」素材和「第四期重建用」素材',
      materials: {
        crafters: [
          { job: 'CRP', materials: [{ name: '最終改良用松木原木', quantity: 20, note: '蒼天街重建獲得' }, { name: '第四期重建用的特供原木（檢）', quantity: 100, note: '重建稀有素材（伐木）' }, { name: '第四期重建用的特供木賊草（檢）', quantity: 100, note: '重建稀有素材（採集）' }] },
          { job: 'BSM', materials: [{ name: '最終改良用清銀礦', quantity: 20, note: '蒼天街重建獲得' }, { name: '第四期重建用的特供礦石（檢）', quantity: 100, note: '重建稀有素材（採礦）' }, { name: '第四期重建用的特供矽砂（檢）', quantity: 100, note: '重建稀有素材（採礦）' }] },
          { job: 'ARM', materials: [{ name: '最終改良用白鎢礦', quantity: 20, note: '蒼天街重建獲得' }, { name: '第四期重建用的特供礦石（檢）', quantity: 100, note: '重建稀有素材（採礦）' }, { name: '第四期重建用的特供彩虹晶（檢）', quantity: 100, note: '重建稀有素材（採礦）' }] },
          { job: 'GSM', materials: [{ name: '最終改良用蒼天石原石', quantity: 20, note: '蒼天街重建獲得' }, { name: '第四期重建用的特供矽砂（檢）', quantity: 100, note: '重建稀有素材（採礦）' }, { name: '第四期重建用的特供木賊草（檢）', quantity: 100, note: '重建稀有素材（採集）' }] },
          { job: 'LTW', materials: [{ name: '最終改良用瞪羚的粗皮', quantity: 20, note: '蒼天街重建獲得' }, { name: '第四期重建用的特供原木（檢）', quantity: 100, note: '重建稀有素材（伐木）' }, { name: '第四期重建用的特供凱門鱷（檢）', quantity: 100, note: '重建稀有素材（釣魚）' }] },
          { job: 'WVR', materials: [{ name: '最終改良用苧麻', quantity: 20, note: '蒼天街重建獲得' }, { name: '第四期重建用的特供蠶繭（檢）', quantity: 100, note: '重建稀有素材（採集）' }, { name: '第四期重建用的特供冰筍（檢）', quantity: 100, note: '重建稀有素材（採礦）' }] },
          { job: 'ALC', materials: [{ name: '最終改良用沼地鹽', quantity: 20, note: '蒼天街重建獲得' }, { name: '第四期重建用的特供矽砂（檢）', quantity: 100, note: '重建稀有素材（採礦）' }, { name: '第四期重建用的特供彩虹晶（檢）', quantity: 100, note: '重建稀有素材（採礦）' }] },
          { job: 'CUL', materials: [{ name: '最終改良用小麥', quantity: 20, note: '蒼天街重建獲得' }, { name: '第四期重建用的特供木賊草（檢）', quantity: 100, note: '重建稀有素材（採集）' }, { name: '第四期重建用的特供凱門鱷（檢）', quantity: 100, note: '重建稀有素材（釣魚）' }] }
        ],
        gatherers: [
          { job: 'MIN', materials: [{ name: '最終改良用蒼天石原石', quantity: 20, note: '蒼天街重建獲得' }, { name: '第四期重建用的特供礦石（檢）', quantity: 100, note: '重建稀有素材（採礦）' }, { name: '第四期重建用的特供矽砂（檢）', quantity: 100, note: '重建稀有素材（採礦）' }] },
          { job: 'BTN', materials: [{ name: '最終改良用松木原木', quantity: 20, note: '蒼天街重建獲得' }, { name: '第四期重建用的特供原木（檢）', quantity: 100, note: '重建稀有素材（伐木）' }, { name: '第四期重建用的特供木賊草（檢）', quantity: 100, note: '重建稀有素材（採集）' }] },
          { job: 'FSH', materials: [{ name: '最終改良用蚯蚓', quantity: 20, note: '蒼天街重建獲得' }, { name: '第四期重建用的特供泥鰍（檢）', quantity: 100, note: '重建稀有素材（釣魚）' }, { name: '第四期重建用的特供雪蟲（檢）', quantity: 100, note: '重建稀有素材（刺魚）' }] }
        ]
      }
    }
  ]
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SKYSTEEL_DATA;
}
