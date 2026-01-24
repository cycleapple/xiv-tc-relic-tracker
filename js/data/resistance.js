// 義武 (Resistance Weapons) - ShB 5.0
// 義軍武器

const RESISTANCE_DATA = {
  id: 'resistance',
  name: '義武',
  fullName: '義軍武器',
  version: '5.0',
  description: '漆黑的反叛者的義軍武器系列',
  stages: [
    {
      id: 'resistance',
      name: '義軍武器',
      ilvl: 485,
      quest: '重現「女王之刃」',
      description: '第一把贈送',
      materials: [
        {
          id: 'scalepowder',
          name: '薩維奈靈鱗粉',
          quantity: 4,
          source: '詩學 250×4',
          tomestone: 1000,
          note: '第二把開始需要\n三主城、伊修加德、摩杜納、田園郡詩學商人均可兌換，分類選《特殊武器相關》（未接任務亦可兌換）'
        }
      ]
    },
    {
      id: 'augmented',
      name: '改良型',
      ilvl: 500,
      quest: '將記憶固定在義軍武器之上',
      materials: [
        {
          id: 'tortured_memory',
          name: '煩惱的記憶晶塊',
          quantity: 20,
          source: '博茲雅/蒼天FATE',
          note: '戰線下層SM/擊殺小怪概率獲得\n庫爾札斯西部高地/阿巴拉提亞雲海 FATE金牌100%獲得'
        },
        {
          id: 'sorrowful_memory',
          name: '悲傷的記憶晶塊',
          quantity: 20,
          source: '博茲雅/蒼天FATE',
          note: '戰線中層SM/擊殺小怪概率獲得\n龍堡參天高地/翻雲霧海 FATE金牌100%獲得'
        },
        {
          id: 'harrowing_memory',
          name: '恐懼的記憶晶塊',
          quantity: 20,
          source: '博茲雅/蒼天FATE',
          note: '戰線上層SM/擊殺小怪概率獲得\n龍堡內陸低地/魔大陸 FATE金牌100%獲得'
        }
      ]
    },
    {
      id: 'recollection',
      name: '回憶',
      ilvl: 500,
      quest: '將勇猛的記憶固定在義軍武器之上',
      materials: [
        {
          id: 'bitter_memory',
          name: '勇猛的記憶晶塊',
          quantity: 6,
          source: '60級副本/博茲雅',
          note: '等級同步60級副本，100%概率獲得\n隨機任務：練級；每日一次\n南方博茲雅戰線衝突戰（SM）/擊殺小怪概率獲得'
        }
      ]
    },
    {
      id: 'law',
      name: '裁決',
      ilvl: 510,
      quest: '義軍武器，變形',
      description: '通關一次女王古殿後解鎖',
      materials: [
        {
          id: 'loathsome_memory',
          name: '厭惡的記憶晶塊',
          quantity: 15,
          source: '24人副本/博茲雅CE',
          note: '等級同步通關水晶塔系列任意副本（古代人迷宮、希爾科斯塔、暗之世界），100%概率獲得\n參加南方博茲雅戰線緊急遭遇戰（CE）概率獲得\n參加帝國湖岸堡攻城戰固定獲得5塊'
        }
      ]
    },
    {
      id: 'augmented_law',
      name: '改良型裁決',
      ilvl: 515,
      quest: '義軍武器的嶄新未來',
      materials: [
        {
          id: 'haunting_memory',
          name: '被丟掉的遺物',
          quantity: 15,
          source: '蒼天地圖FATE/博茲雅',
          note: '女王古殿（一次3個）\n死宮（概率獲得，與層數有關）'
        }
      ]
    },
    {
      id: 'blade',
      name: '女王武器',
      ilvl: 535,
      quest: '真正的義軍武器',
      materials: [
        {
          id: 'raw_emotion',
          name: '光輝的激情晶塊',
          quantity: 15,
          source: '扎杜諾爾高原CE/副本',
          note: '通關女王古殿，一次可獲得2個\n通關扎杜諾爾高原的旗艦達爾里阿達號攻略戰，可獲得3個\n同步狀態下通關70級副本，100%概率獲得\n通關天之御柱，通關後較低概率獲得'
        }
      ]
    }
  ],
  // 共通素材（解鎖後全職業共用）
  sharedMaterials: [
    {
      id: 'shared_quest_1',
      name: '球狀物體，前來救急',
      materials: [
        {
          id: 'haunting_memory_2',
          name: '不祥的記憶晶塊',
          quantity: 18,
          source: '50/60級副本/紅蓮FATE',
          note: '基拉巴尼亞地區（邊區、山區、湖區）FATE概率獲得\n等級同步通關瑪哈之影系列任意副本（魔航船、瑪哈、影之國），100%概率獲得'
        },
        {
          id: 'vexatious_memory',
          name: '忌諱的記憶晶塊',
          quantity: 18,
          source: '70級副本/奧薩德FATE',
          note: '奧薩德地區（紅玉海、草原、延夏）FATE概率獲得\n等級同步通關重返伊瓦利斯系列任意副本（失落之都、燈塔、修道院），100%概率獲得'
        }
      ]
    },
    {
      id: 'shared_quest_2',
      name: '機械零件與靈藥 / 戰鬥記錄與特殊合金 / 記憶晶塊與術式',
      description: '開放扎杜諾爾高原之後完成相應支線任務解鎖',
      materials: [
        {
          id: 'compact_axle',
          name: '超小型傳動軸',
          quantity: 30,
          source: '紅蓮地圖FATE/亞歷山大',
          note: '高原南方SM獲得\n等級同步通關60級Raid亞歷山大系列各章前2層（啟動1、2；律動1、2；天動1、2）獲得'
        },
        {
          id: 'compact_spring',
          name: '超小型彈簧',
          quantity: 30,
          source: '紅蓮地圖FATE/亞歷山大',
          note: '高原南方CE獲得\n等級同步通關60級Raid亞歷山大系列各章後2層（啟動3、4；律動3、4；天動3、4）獲得'
        },
        {
          id: 'battle_records_1',
          name: '激戰記錄：第一集',
          quantity: 30,
          source: '歐米茄1-2層',
          note: '高原西方SM獲得\n等級同步通關70級Raid歐米茄系列各章前2層（德爾塔1、2；西格瑪1、2；阿爾法1、2）獲得'
        },
        {
          id: 'battle_records_2',
          name: '激戰記錄：第二集',
          quantity: 30,
          source: '歐米茄3-4層',
          note: '高原西方CE獲得\n等級同步通關70級Raid歐米茄系列各章後2層（德爾塔3、4；西格瑪3、4；阿爾法3、4）獲得'
        },
        {
          id: 'heavy_memory',
          name: '沉重的記憶晶塊',
          quantity: 30,
          source: '博茲雅/伊甸1-2層',
          note: '高原北方SM獲得\n等級同步通關80級Raid伊甸系列各章前2層（覺醒1、2；共鳴1、2；再生1、2）獲得'
        },
        {
          id: 'violent_memory',
          name: '粗暴的記憶晶塊',
          quantity: 30,
          source: '扎杜諾爾高原/伊甸3-4層',
          note: '高原北方CE獲得\n等級同步通關80級Raid伊甸系列各章後2層（覺醒3、4；共鳴3、4；再生3、4）獲得'
        }
      ]
    }
  ]
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RESISTANCE_DATA;
}
