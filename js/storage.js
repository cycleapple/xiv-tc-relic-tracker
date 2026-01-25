// LocalStorage Module for FF14 Relic Tracker
// 進度存儲模組

const STORAGE_KEY = 'xiv-relic-tracker-progress';
const STORAGE_VERSION = 1;

const Storage = {
  // Default data structure
  getDefaultData() {
    return {
      version: STORAGE_VERSION,
      lastUpdated: null,
      progress: {
        zodiac: {},
        anima: {},
        eureka: {},
        resistance: {},
        manderville: {},
        aetherial: {}
      },
      settings: {
        expandedStages: {},
        lastSelectedTab: 'zodiac',
        lastSelectedJobs: {}
      }
    };
  },

  // Load all data from localStorage
  load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return this.getDefaultData();
      }

      const data = JSON.parse(stored);

      // Handle version migration if needed
      if (!data.version || data.version < STORAGE_VERSION) {
        return this.migrate(data);
      }

      return data;
    } catch (e) {
      console.error('Failed to load progress data:', e);
      return this.getDefaultData();
    }
  },

  // Save all data to localStorage
  save(data) {
    try {
      data.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Failed to save progress data:', e);
      return false;
    }
  },

  // Migrate old data format to new version
  migrate(oldData) {
    const newData = this.getDefaultData();

    // Copy over any existing progress data
    if (oldData.progress) {
      Object.keys(oldData.progress).forEach(relicType => {
        if (newData.progress[relicType]) {
          newData.progress[relicType] = oldData.progress[relicType];
        }
      });
    }

    // Copy over settings
    if (oldData.settings) {
      newData.settings = { ...newData.settings, ...oldData.settings };
    }

    // Save migrated data
    this.save(newData);

    return newData;
  },

  // Get progress for a specific relic type and job
  getJobProgress(relicType, jobId) {
    const data = this.load();
    return data.progress[relicType]?.[jobId] || {};
  },

  // Update progress for a specific material
  updateMaterialProgress(relicType, jobId, stageId, materialId, value) {
    const data = this.load();

    if (!data.progress[relicType]) {
      data.progress[relicType] = {};
    }
    if (!data.progress[relicType][jobId]) {
      data.progress[relicType][jobId] = {};
    }
    if (!data.progress[relicType][jobId][stageId]) {
      data.progress[relicType][jobId][stageId] = {};
    }

    data.progress[relicType][jobId][stageId][materialId] = value;

    return this.save(data);
  },

  // Toggle material completion
  toggleMaterialComplete(relicType, jobId, stageId, materialId, required) {
    const data = this.load();
    const current = data.progress[relicType]?.[jobId]?.[stageId]?.[materialId] || 0;

    // Toggle between 0 and required amount
    const newValue = current >= required ? 0 : required;

    return this.updateMaterialProgress(relicType, jobId, stageId, materialId, newValue);
  },

  // Increment/decrement material quantity
  adjustMaterialQuantity(relicType, jobId, stageId, materialId, delta, max) {
    const data = this.load();
    const current = data.progress[relicType]?.[jobId]?.[stageId]?.[materialId] || 0;
    const newValue = Math.max(0, Math.min(max, current + delta));

    return this.updateMaterialProgress(relicType, jobId, stageId, materialId, newValue);
  },

  // Mark entire stage as complete
  completeStage(relicType, jobId, stageId, materials) {
    const data = this.load();

    if (!data.progress[relicType]) {
      data.progress[relicType] = {};
    }
    if (!data.progress[relicType][jobId]) {
      data.progress[relicType][jobId] = {};
    }

    data.progress[relicType][jobId][stageId] = {};
    materials.forEach(mat => {
      data.progress[relicType][jobId][stageId][mat.id] = mat.quantity;
    });

    return this.save(data);
  },

  // Reset progress for a job
  resetJobProgress(relicType, jobId) {
    const data = this.load();

    if (data.progress[relicType]) {
      delete data.progress[relicType][jobId];
    }

    return this.save(data);
  },

  // Reset all progress for a relic type
  resetRelicProgress(relicType) {
    const data = this.load();
    data.progress[relicType] = {};
    return this.save(data);
  },

  // Reset all progress
  resetAllProgress() {
    const data = this.getDefaultData();
    return this.save(data);
  },

  // Calculate progress statistics for a job
  calculateJobStats(relicType, jobId, stages) {
    const data = this.load();
    const jobProgress = data.progress[relicType]?.[jobId] || {};

    let totalMaterials = 0;
    let completedMaterials = 0;
    let completedStages = 0;

    stages.forEach(stage => {
      if (!stage.materials) return;

      // Handle skysteel's different material structure
      let materials = stage.materials;
      if (!Array.isArray(materials)) {
        // For skysteel, get job-specific materials
        const isCrafter = typeof JOBS !== 'undefined' && JOBS.crafters?.jobs?.[jobId];
        const jobMaterials = materials[isCrafter ? 'crafters' : 'gatherers'];
        if (jobMaterials) {
          const jobData = jobMaterials.find(m => m.job === jobId);
          materials = jobData?.materials || [];
        } else {
          materials = [];
        }
      }

      if (!Array.isArray(materials) || materials.length === 0) return;

      let stageComplete = true;
      materials.forEach((mat, idx) => {
        const matId = mat.id || `${stage.id}_${idx}`;
        totalMaterials++;
        const current = jobProgress[stage.id]?.[matId] || 0;
        if (current >= mat.quantity) {
          completedMaterials++;
        } else {
          stageComplete = false;
        }
      });

      if (stageComplete && materials.length > 0) {
        completedStages++;
      }
    });

    return {
      totalMaterials,
      completedMaterials,
      completedStages,
      totalStages: stages.filter(s => s.materials && (Array.isArray(s.materials) ? s.materials.length > 0 : true)).length,
      percentage: totalMaterials > 0 ? Math.round((completedMaterials / totalMaterials) * 100) : 0
    };
  },

  // Save UI settings
  saveSettings(settings) {
    const data = this.load();
    data.settings = { ...data.settings, ...settings };
    return this.save(data);
  },

  // Get UI settings
  getSettings() {
    const data = this.load();
    return data.settings;
  },

  // Export data as JSON
  exportData() {
    const data = this.load();
    return JSON.stringify(data, null, 2);
  },

  // Import data from JSON
  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data.progress) {
        throw new Error('Invalid data format');
      }
      data.version = STORAGE_VERSION;
      return this.save(data);
    } catch (e) {
      console.error('Failed to import data:', e);
      return false;
    }
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Storage;
}
