// 曼武 (Manderville Weapons) - EW 6.0
// 曼德維爾武器

const MANDERVILLE_DATA = {
  id: 'manderville',
  name: '曼武',
  fullName: '曼德維爾武器',
  version: '6.0',
  description: '曉月之終途的曼德維爾武器系列',
  prerequisite: '需完成調查員系列任務（約40個任務）',
  stages: [
    {
      id: 'manderville_1',
      name: '曼德維爾武器',
      ilvl: 615,
      quest: '曼德維爾家的古老武器 / 再次製作曼德維爾武器',
      materials: [
        {
          id: 'meteorite',
          name: '稀少隕石',
          quantity: 3,
          source: '詩學 500×3',
          tomestone: 1500,
          note: '玖布倫娜（拉札罕 X:12.2, Y:10.9）\n三主城、伊修加德、摩杜納、田園郡、拉札罕詩學商人均可兌換\n分類選《特殊武器相關》（未接任務亦可兌換）'
        }
      ]
    },
    {
      id: 'manderville_2',
      name: '令人驚異的曼德維爾武器',
      ilvl: 630,
      quest: '覺醒吧！鬥爭本能！',
      materials: [
        {
          id: 'chondrite',
          name: '稀少球粒隕石',
          quantity: 3,
          source: '詩學 500×3',
          tomestone: 1500,
          note: '玖布倫娜（拉札罕 X:12.2, Y:10.9）\n三主城、伊修加德、摩杜納、田園郡、拉札罕詩學商人均可兌換\n分類選《特殊武器相關》（未接任務亦可兌換）'
        }
      ]
    },
    {
      id: 'manderville_3',
      name: '靈活變化的曼德維爾武器',
      ilvl: 645,
      quest: '工匠們的酒宴',
      materials: [
        {
          id: 'achondrite',
          name: '稀少無球粒隕石',
          quantity: 3,
          source: '詩學 500×3',
          tomestone: 1500,
          note: '玖布倫娜（拉札罕 X:12.2, Y:10.9）\n三主城、伊修加德、摩杜納、田園郡、拉札罕詩學商人均可兌換\n分類選《特殊武器相關》（未接任務亦可兌換）'
        }
      ]
    },
    {
      id: 'manderville_4',
      name: '精美絕倫的曼德維爾武器',
      ilvl: 665,
      quest: '起舞的工匠們',
      materials: [
        {
          id: 'cosmic_crystallite',
          name: '雛晶',
          quantity: 3,
          source: '詩學 500×3',
          tomestone: 1500,
          note: '玖布倫娜（拉札罕 X:12.2, Y:10.9）\n三主城、伊修加德、摩杜納、田園郡、拉札罕詩學商人均可兌換\n分類選《特殊武器相關》（未接任務亦可兌換）'
        }
      ]
    }
  ]
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MANDERVILLE_DATA;
}
