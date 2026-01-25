// FF14 Jobs Data - Traditional Chinese
// 職業數據

const JOBS = {
  // 坦克 (Tank)
  tanks: {
    name: '坦克',
    jobs: {
      PLD: { name: '騎士', icon: 'images/jobs/Paladin.png', abbr: 'PLD' },
      WAR: { name: '戰士', icon: 'images/jobs/Warrior.png', abbr: 'WAR' },
      DRK: { name: '暗黑騎士', icon: 'images/jobs/DarkKnight.png', abbr: 'DRK' },
      GNB: { name: '絕槍戰士', icon: 'images/jobs/Gunbreaker.png', abbr: 'GNB' }
    }
  },
  // 治療 (Healer)
  healers: {
    name: '治療',
    jobs: {
      WHM: { name: '白魔法師', icon: 'images/jobs/WhiteMage.png', abbr: 'WHM' },
      SCH: { name: '學者', icon: 'images/jobs/Scholar.png', abbr: 'SCH' },
      AST: { name: '占星術士', icon: 'images/jobs/Astrologian.png', abbr: 'AST' },
      SGE: { name: '賢者', icon: 'images/jobs/Sage.png', abbr: 'SGE' }
    }
  },
  // 近戰 DPS (Melee DPS)
  melee: {
    name: '近戰',
    jobs: {
      MNK: { name: '武僧', icon: 'images/jobs/Monk.png', abbr: 'MNK' },
      DRG: { name: '龍騎士', icon: 'images/jobs/Dragoon.png', abbr: 'DRG' },
      NIN: { name: '忍者', icon: 'images/jobs/Ninja.png', abbr: 'NIN' },
      SAM: { name: '武士', icon: 'images/jobs/Samurai.png', abbr: 'SAM' },
      RPR: { name: '鐮刀師', icon: 'images/jobs/Reaper.png', abbr: 'RPR' },
      VPR: { name: '蝮蛇劍士', icon: 'images/jobs/Viper.png', abbr: 'VPR' }
    }
  },
  // 遠程物理 DPS (Physical Ranged DPS)
  ranged: {
    name: '遠程',
    jobs: {
      BRD: { name: '詩人', icon: 'images/jobs/Bard.png', abbr: 'BRD' },
      MCH: { name: '機工士', icon: 'images/jobs/Machinist.png', abbr: 'MCH' },
      DNC: { name: '舞者', icon: 'images/jobs/Dancer.png', abbr: 'DNC' }
    }
  },
  // 遠程魔法 DPS (Magical Ranged DPS)
  casters: {
    name: '法師',
    jobs: {
      BLM: { name: '黑魔法師', icon: 'images/jobs/BlackMage.png', abbr: 'BLM' },
      SMN: { name: '召喚師', icon: 'images/jobs/Summoner.png', abbr: 'SMN' },
      RDM: { name: '赤魔法師', icon: 'images/jobs/RedMage.png', abbr: 'RDM' },
      PCT: { name: '繪靈法師', icon: 'images/jobs/Pictomancer.png', abbr: 'PCT' }
    }
  },
  // 生產職業 (Crafters)
  crafters: {
    name: '生產',
    jobs: {
      CRP: { name: '刻木匠', icon: 'images/jobs/Carpenter.png', abbr: 'CRP' },
      BSM: { name: '鍛鐵匠', icon: 'images/jobs/Blacksmith.png', abbr: 'BSM' },
      ARM: { name: '鑄甲匠', icon: 'images/jobs/Armorer.png', abbr: 'ARM' },
      GSM: { name: '雕金匠', icon: 'images/jobs/Goldsmith.png', abbr: 'GSM' },
      LTW: { name: '製革匠', icon: 'images/jobs/Leatherworker.png', abbr: 'LTW' },
      WVR: { name: '裁衣匠', icon: 'images/jobs/Weaver.png', abbr: 'WVR' },
      ALC: { name: '煉金術士', icon: 'images/jobs/Alchemist.png', abbr: 'ALC' },
      CUL: { name: '烹調師', icon: 'images/jobs/Culinarian.png', abbr: 'CUL' }
    }
  },
  // 採集職業 (Gatherers)
  gatherers: {
    name: '採集',
    jobs: {
      MIN: { name: '採礦工', icon: 'images/jobs/Miner.png', abbr: 'MIN' },
      BTN: { name: '園藝工', icon: 'images/jobs/Botanist.png', abbr: 'BTN' },
      FSH: { name: '捕魚人', icon: 'images/jobs/Fisher.png', abbr: 'FSH' }
    }
  }
};

// Job availability by relic type
const RELIC_JOBS = {
  zodiac: ['PLD', 'WAR', 'WHM', 'SCH', 'MNK', 'DRG', 'NIN', 'BRD', 'BLM', 'SMN'],
  anima: ['PLD', 'WAR', 'DRK', 'WHM', 'SCH', 'AST', 'MNK', 'DRG', 'NIN', 'BRD', 'MCH', 'BLM', 'SMN'],
  eureka: ['PLD', 'WAR', 'DRK', 'WHM', 'SCH', 'AST', 'MNK', 'DRG', 'NIN', 'SAM', 'BRD', 'MCH', 'BLM', 'SMN', 'RDM'],
  resistance: ['PLD', 'WAR', 'DRK', 'GNB', 'WHM', 'SCH', 'AST', 'MNK', 'DRG', 'NIN', 'SAM', 'BRD', 'MCH', 'DNC', 'BLM', 'SMN', 'RDM'],
  manderville: ['PLD', 'WAR', 'DRK', 'GNB', 'WHM', 'SCH', 'AST', 'SGE', 'MNK', 'DRG', 'NIN', 'SAM', 'RPR', 'BRD', 'MCH', 'DNC', 'BLM', 'SMN', 'RDM'],
  aetherial: ['PLD', 'WAR', 'DRK', 'GNB', 'WHM', 'SCH', 'AST', 'SGE', 'MNK', 'DRG', 'NIN', 'SAM', 'RPR', 'VPR', 'BRD', 'MCH', 'DNC', 'BLM', 'SMN', 'RDM', 'PCT']
};

// Get job info by ID
function getJobInfo(jobId) {
  for (const category of Object.values(JOBS)) {
    if (category.jobs && category.jobs[jobId]) {
      return category.jobs[jobId];
    }
  }
  return null;
}

// Get all jobs for a relic type
function getRelicJobs(relicType) {
  const jobIds = RELIC_JOBS[relicType] || [];
  return jobIds.map(id => ({ id, ...getJobInfo(id) })).filter(j => j.name);
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { JOBS, RELIC_JOBS, getJobInfo, getRelicJobs };
}
