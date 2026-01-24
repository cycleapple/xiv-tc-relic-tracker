// UI Rendering Module for FF14 Relic Tracker
// 重新設計的 UI - 以快速參考為核心

const UI = {
  // Current state
  state: {
    currentTab: 'zodiac',
    currentMode: 'reference', // 'reference' or 'tracking'
    selectedJob: null,
    expandedStages: new Set()
  },

  // Initialize UI
  init() {
    this.renderTabs();
    this.bindEvents();
    this.loadSettings();
  },

  // Load saved settings
  loadSettings() {
    const settings = Storage.getSettings();
    if (settings.lastSelectedTab) {
      this.switchTab(settings.lastSelectedTab);
    } else {
      this.switchTab('zodiac');
    }
    if (settings.currentMode) {
      this.state.currentMode = settings.currentMode;
    }
  },

  // Render tab navigation
  renderTabs() {
    const tabNav = document.getElementById('tab-nav');
    const relics = [
      { id: 'zodiac', name: '古武', version: '2.0' },
      { id: 'anima', name: '魂武', version: '3.0' },
      { id: 'eureka', name: '優武', version: '4.0' },
      { id: 'resistance', name: '義武', version: '5.0' },
      { id: 'manderville', name: '曼武', version: '6.0' },
      { id: 'aetherial', name: '幻武', version: '7.0' },
      { id: 'skysteel', name: '天鋼工具', version: '5.0' }
    ];

    tabNav.innerHTML = relics.map(relic => `
      <button class="tab-btn ${relic.id === this.state.currentTab ? 'active' : ''}"
              data-tab="${relic.id}">
        ${relic.name}
        <span class="version">${relic.version}</span>
      </button>
    `).join('');
  },

  // Switch to a tab
  switchTab(tabId) {
    this.state.currentTab = tabId;
    this.state.selectedJob = null;

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Update content
    document.querySelectorAll('.content-area').forEach(area => {
      area.classList.toggle('active', area.id === `content-${tabId}`);
    });

    // Render content based on mode
    this.renderContent(tabId);

    // Save setting
    Storage.saveSettings({ lastSelectedTab: tabId });
  },

  // Render main content
  renderContent(relicType) {
    const container = document.getElementById(`stages-${relicType}`);
    const jobContainer = document.getElementById(`jobs-${relicType}`);
    if (!container) return;

    const data = this.getRelicData(relicType);
    if (!data) {
      container.innerHTML = '<p class="text-center text-muted">無數據</p>';
      return;
    }

    // Always show reference view first, then tracking below
    const html = `
      ${this.renderRelicHeader(data)}
      ${this.renderMaterialSummary(data)}
      ${this.renderModeToggle(relicType)}
      <div id="view-${relicType}">
        ${this.state.currentMode === 'tracking'
          ? this.renderTrackingView(relicType, data)
          : this.renderReferenceView(relicType, data)}
      </div>
    `;

    // Clear job selector in parent
    if (jobContainer) {
      jobContainer.innerHTML = '';
      jobContainer.parentElement.style.display = 'none';
    }

    container.innerHTML = html;
  },

  // Render relic header with info
  renderRelicHeader(data) {
    return `
      <div class="relic-header">
        <div class="relic-title">
          <h2>${data.fullName || data.name}</h2>
          <span class="version-badge">${data.version}</span>
        </div>
        ${data.description ? `<p class="relic-description">${data.description}</p>` : ''}
        ${data.prerequisite ? `<p class="relic-prereq">⚠️ ${data.prerequisite}</p>` : ''}
      </div>
    `;
  },

  // Render material summary - total materials needed
  renderMaterialSummary(data) {
    if (!data.stages) return '';

    // Aggregate all materials, grouped by source type
    const materialMap = new Map();

    // Helper to add materials to map
    const addMaterials = (materials) => {
      if (!Array.isArray(materials)) return;
      materials.forEach(mat => {
        const key = mat.name;
        if (materialMap.has(key)) {
          const existing = materialMap.get(key);
          existing.quantity += mat.quantity;
        } else {
          materialMap.set(key, {
            name: mat.name,
            quantity: mat.quantity,
            source: mat.source || '',
            sourceType: this.getSourceType(mat.source || ''),
            tomestone: mat.tomestone || 0,
            note: mat.note || ''
          });
        }
      });
    };

    // Add stage materials
    data.stages.forEach(stage => {
      if (!stage.materials) return;

      // Handle skysteel differently - use first job's materials as reference
      let materials = stage.materials;
      if (Array.isArray(stage.materials.crafters)) {
        materials = stage.materials.crafters[0]?.materials || [];
      }

      addMaterials(materials);
    });

    // Add prerequisite materials (for aetherial)
    if (data.prerequisiteMaterials) {
      data.prerequisiteMaterials.forEach(section => {
        addMaterials(section.materials);
      });
    }

    // Add shared materials
    if (data.sharedMaterials) {
      data.sharedMaterials.forEach(section => {
        addMaterials(section.materials);
      });
    }

    if (materialMap.size === 0) return '';

    const materials = Array.from(materialMap.values());

    // Group by source type for better organization
    const grouped = {};
    materials.forEach(mat => {
      const type = mat.sourceType;
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(mat);
    });

    // Calculate total tomestones
    const totalTomestone = materials.reduce((sum, m) => sum + (m.tomestone || 0), 0);

    return `
      <details class="material-summary-compact" open>
        <summary class="summary-header">
          <span class="summary-title-text">📋 材料總覽</span>
          ${totalTomestone > 0 ? `<span class="summary-tomestone">💎 詩學總計: ${totalTomestone}</span>` : ''}
          <span class="summary-count">${materials.length} 種材料</span>
        </summary>
        <div class="summary-table">
          ${materials.map(mat => {
            // Build tooltip with tomestone cost and note
            let tooltipParts = [];
            if (mat.tomestone) {
              tooltipParts.push(`💎 詩學消耗: ${mat.tomestone}`);
            }
            if (mat.source) {
              tooltipParts.push(`來源: ${mat.source}`);
            }
            if (mat.note && mat.note.trim()) {
              tooltipParts.push(mat.note.trim());
            }
            const hasTooltip = tooltipParts.length > 0;
            const tooltipText = tooltipParts.join('&#10;').replace(/"/g, '&quot;').replace(/\n/g, '&#10;');
            return `
            <div class="summary-row source-${mat.sourceType} ${hasTooltip ? 'has-tooltip' : ''}"
                 ${hasTooltip ? `data-tooltip="${tooltipText}"` : ''}>
              <span class="summary-name">${mat.name}${hasTooltip ? ' ℹ️' : ''}</span>
              <span class="summary-qty">×${mat.quantity}</span>
              <span class="summary-source">${this.getShortSource(mat.source)}</span>
            </div>
          `}).join('')}
        </div>
      </details>
    `;
  },

  // Get short source text for summary with icon
  getShortSource(source) {
    if (!source) return '-';
    // Extract the main source type with icon
    const s = source.toLowerCase();
    if (s.includes('詩學')) return '💎詩學';
    if (s.includes('天道')) return '💎天道';
    if (s.includes('博茲雅')) return '⚔️博茲雅';
    if (s.includes('優雷卡') || s.includes('eureka')) return '🌋優雷卡';
    if (s.includes('扎杜諾爾')) return '⚔️扎杜諾爾';
    if (s.includes('fate')) return '⚡FATE';
    if (s.includes('24人') || s.includes('raid')) return '👥24人本';
    if (s.includes('副本')) return '🏰副本';
    if (s.includes('製作')) return '🔨製作';
    if (s.includes('採集') || s.includes('採礦') || s.includes('伐木')) return '⛏️採集';
    if (s.includes('軍票')) return '🎖️軍票';
    if (s.includes('金幣')) return '💰金幣';
    if (s.includes('寶石')) return '💠寶石';
    if (s.includes('nm') || s.includes('掉落')) return '👹NM';
    // Fallback: first part before /
    const parts = source.split('/');
    return parts[0].substring(0, 10);
  },

  // Render mode toggle
  renderModeToggle(relicType) {
    return `
      <div class="mode-toggle">
        <button class="mode-btn ${this.state.currentMode === 'reference' ? 'active' : ''}"
                onclick="UI.setMode('reference', '${relicType}')">
          📖 參考模式
        </button>
        <button class="mode-btn ${this.state.currentMode === 'tracking' ? 'active' : ''}"
                onclick="UI.setMode('tracking', '${relicType}')">
          ✅ 追蹤進度
        </button>
      </div>
    `;
  },

  // Set view mode
  setMode(mode, relicType) {
    this.state.currentMode = mode;
    Storage.saveSettings({ currentMode: mode });

    const viewContainer = document.getElementById(`view-${relicType}`);
    const data = this.getRelicData(relicType);

    if (viewContainer && data) {
      viewContainer.innerHTML = mode === 'tracking'
        ? this.renderTrackingView(relicType, data)
        : this.renderReferenceView(relicType, data);
    }

    // Update mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.includes(mode === 'reference' ? '參考' : '追蹤'));
    });
  },

  // Render reference view - all stages expanded, no job selection needed
  renderReferenceView(relicType, data) {
    if (!data.stages) return '<p>無階段數據</p>';

    // For skysteel, show one example job's materials
    const isSkysteel = relicType === 'skysteel';

    return `
      ${this.renderPrerequisiteMaterials(data)}
      <div class="stages-timeline">
        ${data.stages.map((stage, index) => {
          // Get materials for display
          let materials = stage.materials;
          if (isSkysteel && materials) {
            if (materials.crafters && materials.crafters[0]) {
              materials = materials.crafters[0].materials.map((m, i) => ({
                id: `${stage.id}_${i}`,
                name: m.name,
                quantity: m.quantity,
                source: m.note || ''
              }));
            } else {
              materials = [];
            }
          }

          return this.renderStageCard(stage, index + 1, materials, false, relicType, null);
        }).join('')}
      </div>
      ${this.renderSharedMaterials(data)}
    `;
  },

  // Render prerequisite materials section (for aetherial weapons)
  renderPrerequisiteMaterials(data) {
    if (!data.prerequisiteMaterials || data.prerequisiteMaterials.length === 0) return '';

    return `
      <div class="prerequisite-materials">
        <h3 class="prereq-title">前置收集（全職業共用）</h3>
        ${data.prerequisiteMaterials.map((section, index) => `
          <div class="stage-card expanded" data-step="⭐">
            <div class="stage-header">
              <div class="stage-main-info">
                <div class="stage-name-wrapper">
                  <span class="stage-name">${section.name}</span>
                </div>
              </div>
            </div>
            <div class="stage-content">
              ${section.description ? `<div class="stage-description">${section.description}</div>` : ''}
              ${this.renderMaterialGrid(section.materials, false, null, null, null, {})}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  // Render tracking view - with job selection and progress
  renderTrackingView(relicType, data) {
    return `
      ${this.renderJobSelector(relicType)}
      <div id="tracking-stages-${relicType}">
        ${this.state.selectedJob
          ? this.renderTrackingStages(relicType, data)
          : `<div class="no-selection">
              <p>請先選擇一個職業來追蹤進度</p>
            </div>`
        }
      </div>
    `;
  },

  // Render job selector
  renderJobSelector(relicType) {
    const jobs = getRelicJobs(relicType);
    const data = this.getRelicData(relicType);
    const grouped = this.groupJobsByRole(jobs);

    return `
      <div class="job-selector">
        <h3>選擇要追蹤的職業</h3>
        ${Object.entries(grouped).map(([role, roleJobs]) => `
          <div class="role-section">
            <div class="role-header">${role}</div>
            <div class="job-grid">
              ${roleJobs.map(job => {
                const stats = Storage.calculateJobStats(relicType, job.id, data?.stages || []);
                const isComplete = stats.percentage === 100;
                return `
                  <button class="job-btn ${this.state.selectedJob === job.id ? 'selected' : ''} ${isComplete ? 'completed' : ''}"
                          data-job="${job.id}" data-relic="${relicType}">
                    <img class="job-icon" src="${job.icon}" alt="${job.name}">
                    <span class="job-name">${job.name}</span>
                    <span class="job-progress">${stats.percentage}%</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  // Render tracking stages with progress controls
  renderTrackingStages(relicType, data) {
    if (!data.stages) return '';

    const jobId = this.state.selectedJob;
    const jobProgress = Storage.getJobProgress(relicType, jobId);
    const stats = Storage.calculateJobStats(relicType, jobId, data.stages);
    const jobInfo = getJobInfo(jobId);

    // Handle skysteel
    const isSkysteel = relicType === 'skysteel';
    const stages = isSkysteel ? this.getSkySteelStages(data.stages, jobId) : data.stages;

    return `
      <div class="progress-overview">
        <div class="progress-header">
          <span class="progress-title">${jobInfo?.icon ? `<img class="job-icon-sm" src="${jobInfo.icon}" alt="${jobInfo.name}">` : ''} ${jobInfo?.name || jobId}</span>
          <span class="progress-stats">${stats.completedStages}/${stats.totalStages} 階段 · ${stats.percentage}%</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${stats.percentage}%"></div>
        </div>
      </div>

      <div class="quick-actions">
        <button class="action-btn" onclick="UI.expandAllStages('${relicType}')">展開全部</button>
        <button class="action-btn" onclick="UI.collapseAllStages('${relicType}')">收起全部</button>
        <button class="action-btn danger" onclick="UI.confirmResetJob('${relicType}', '${jobId}')">重置進度</button>
      </div>

      <div class="stages-timeline">
        ${stages.map((stage, index) => {
          const stageProgress = this.calculateStageProgress(stage, jobProgress);
          return this.renderStageCard(stage, index + 1, stage.materials, true, relicType, jobId, jobProgress, stageProgress);
        }).join('')}
      </div>
    `;
  },

  // Calculate stage progress
  calculateStageProgress(stage, jobProgress) {
    if (!stage.materials || !Array.isArray(stage.materials)) {
      return { complete: 0, total: 0, percentage: 100 };
    }

    let complete = 0;
    let total = stage.materials.length;

    stage.materials.forEach(mat => {
      const current = jobProgress[stage.id]?.[mat.id] || 0;
      if (current >= mat.quantity) complete++;
    });

    return {
      complete,
      total,
      percentage: total > 0 ? Math.round((complete / total) * 100) : 100
    };
  },

  // Render a single stage card
  renderStageCard(stage, stepNumber, materials, isTracking, relicType, jobId, jobProgress = {}, stageProgress = null) {
    const stageKey = `${relicType}-${stage.id}`;
    const isExpanded = !isTracking || this.state.expandedStages.has(stageKey) || this.state.expandedStages.size === 0;
    const isComplete = stageProgress && stageProgress.percentage === 100;

    return `
      <div class="stage-card ${isExpanded ? 'expanded' : ''} ${isComplete ? 'completed' : ''}"
           data-step="${stepNumber}"
           data-stage-key="${stageKey}">
        <div class="stage-header" onclick="UI.toggleStage('${stageKey}')">
          <div class="stage-main-info">
            <div class="stage-name-wrapper">
              <span class="stage-name">${stage.name}</span>
              ${stage.ilvl ? `<span class="stage-ilvl">iLv ${stage.ilvl}</span>` : ''}
            </div>
            ${isTracking && stageProgress ? `
              <span class="stage-toggle">▼</span>
            ` : ''}
          </div>
          ${stage.quest ? `<div class="stage-quest">任務：${stage.quest}</div>` : ''}
        </div>
        <div class="stage-content" style="${isExpanded || !isTracking ? '' : 'display:none'}">
          ${stage.description ? `<div class="stage-description">${stage.description}</div>` : ''}
          ${this.renderMaterialGrid(materials, isTracking, relicType, jobId, stage.id, jobProgress)}
        </div>
      </div>
    `;
  },

  // Render material grid
  renderMaterialGrid(materials, isTracking, relicType, jobId, stageId, jobProgress) {
    if (!materials || !Array.isArray(materials) || materials.length === 0) {
      return '<p class="text-muted">此階段無需材料，完成任務即可</p>';
    }

    return `
      <div class="material-grid">
        ${materials.map(mat => {
          const current = isTracking ? (jobProgress[stageId]?.[mat.id] || 0) : 0;
          const isComplete = current >= mat.quantity;
          const sourceType = this.getSourceType(mat.source || '');
          const sourceBadges = this.parseSourceBadges(mat.source || '');

          return `
            <div class="material-card ${isComplete ? 'completed' : ''}">
              ${isTracking ? `
                <input type="checkbox" class="mat-checkbox"
                       ${isComplete ? 'checked' : ''}
                       onchange="UI.toggleMaterial('${relicType}', '${jobId}', '${stageId}', '${mat.id}', ${mat.quantity})">
              ` : '<div></div>'}
              <div class="mat-info">
                <div class="mat-name">${mat.name} <span class="text-muted">×${mat.quantity}</span></div>
                <div class="mat-source">
                  ${sourceBadges}
                </div>
                ${mat.tomestone ? `<div class="mat-tomestone">詩學總計: <strong>${mat.tomestone}</strong></div>` : ''}
                ${mat.note ? `<div class="mat-note">${mat.note.replace(/\n/g, '<br>')}</div>` : ''}
              </div>
              ${isTracking ? `
                <div class="mat-controls">
                  <button class="qty-btn"
                          onclick="UI.adjustQuantity('${relicType}', '${jobId}', '${stageId}', '${mat.id}', -1, ${mat.quantity})"
                          ${current <= 0 ? 'disabled' : ''}>−</button>
                  <span class="qty-display">
                    <span class="qty-current">${current}</span>
                    <span class="qty-required">/${mat.quantity}</span>
                  </span>
                  <button class="qty-btn"
                          onclick="UI.adjustQuantity('${relicType}', '${jobId}', '${stageId}', '${mat.id}', 1, ${mat.quantity})"
                          ${current >= mat.quantity ? 'disabled' : ''}>+</button>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  // Get source type from source string
  getSourceType(source) {
    const s = source.toLowerCase();
    if (s.includes('詩學') || s.includes('tomestone')) return 'tomestone';
    if (s.includes('fate')) return 'fate';
    if (s.includes('24人') || s.includes('raid')) return 'raid';
    if (s.includes('副本') || s.includes('dungeon') || s.includes('級')) return 'dungeon';
    if (s.includes('博茲雅') || s.includes('bozja') || s.includes('扎杜諾爾')) return 'bozja';
    if (s.includes('優雷卡') || s.includes('eureka')) return 'eureka';
    if (s.includes('製作') || s.includes('craft')) return 'craft';
    if (s.includes('採集') || s.includes('gather')) return 'gather';
    return 'dungeon';
  },

  // Parse source string into badges
  parseSourceBadges(source) {
    if (!source) return '<span class="source-badge npc">請查詢任務說明</span>';

    const badges = [];
    const parts = source.split(/[\/、,]/);

    parts.forEach(part => {
      const trimmed = part.trim();
      if (!trimmed) return;

      const type = this.getSourceType(trimmed);
      let icon = '';

      switch(type) {
        case 'tomestone': icon = '💎'; break;
        case 'fate': icon = '⚡'; break;
        case 'dungeon': icon = '🏰'; break;
        case 'raid': icon = '👥'; break;
        case 'bozja': icon = '⚔️'; break;
        case 'eureka': icon = '🌋'; break;
        case 'craft': icon = '🔨'; break;
        case 'gather': icon = '⛏️'; break;
        default: icon = '📍';
      }

      badges.push(`<span class="source-badge ${type}">${icon} ${trimmed}</span>`);
    });

    return badges.join('');
  },

  // Render shared materials section
  renderSharedMaterials(data) {
    if (!data.sharedMaterials || data.sharedMaterials.length === 0) return '';

    return `
      <div class="shared-materials">
        <h3 class="shared-title">共通素材（解鎖後全職業共用）</h3>
        ${data.sharedMaterials.map(quest => `
          <div class="stage-card expanded" data-step="★">
            <div class="stage-header">
              <div class="stage-main-info">
                <div class="stage-name-wrapper">
                  <span class="stage-name">${quest.name}</span>
                </div>
              </div>
            </div>
            <div class="stage-content">
              ${quest.description ? `<div class="stage-description">${quest.description}</div>` : ''}
              ${this.renderMaterialGrid(quest.materials, false, null, null, null, {})}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  // Get skysteel stages with job-specific materials
  getSkySteelStages(stages, jobId) {
    const isCrafter = JOBS.crafters.jobs[jobId];

    return stages.map(stage => {
      if (!stage.materials) return stage;

      const jobMaterials = stage.materials[isCrafter ? 'crafters' : 'gatherers'];
      if (!jobMaterials) return stage;

      const jobData = jobMaterials.find(m => m.job === jobId);
      if (!jobData) return { ...stage, materials: [] };

      return {
        ...stage,
        materials: jobData.materials.map((mat, idx) => ({
          id: `${stage.id}_${idx}`,
          name: mat.name,
          quantity: mat.quantity,
          source: ''
        }))
      };
    });
  },

  // Group jobs by their role
  groupJobsByRole(jobs) {
    const roleMap = {
      tanks: '坦克',
      healers: '治療',
      melee: '近戰',
      ranged: '遠程',
      casters: '法師',
      crafters: '生產',
      gatherers: '採集'
    };

    const grouped = {};

    jobs.forEach(job => {
      for (const [roleKey, roleData] of Object.entries(JOBS)) {
        if (roleData.jobs && roleData.jobs[job.id]) {
          const roleName = roleMap[roleKey] || roleData.name;
          if (!grouped[roleName]) {
            grouped[roleName] = [];
          }
          grouped[roleName].push(job);
          break;
        }
      }
    });

    return grouped;
  },

  // Get relic data by type
  getRelicData(relicType) {
    const dataMap = {
      zodiac: typeof ZODIAC_DATA !== 'undefined' ? ZODIAC_DATA : null,
      anima: typeof ANIMA_DATA !== 'undefined' ? ANIMA_DATA : null,
      eureka: typeof EUREKA_DATA !== 'undefined' ? EUREKA_DATA : null,
      resistance: typeof RESISTANCE_DATA !== 'undefined' ? RESISTANCE_DATA : null,
      manderville: typeof MANDERVILLE_DATA !== 'undefined' ? MANDERVILLE_DATA : null,
      aetherial: typeof AETHERIAL_DATA !== 'undefined' ? AETHERIAL_DATA : null,
      skysteel: typeof SKYSTEEL_DATA !== 'undefined' ? SKYSTEEL_DATA : null
    };
    return dataMap[relicType];
  },

  // Select a job (tracking mode)
  selectJob(relicType, jobId) {
    this.state.selectedJob = jobId;

    // Update job button styles
    document.querySelectorAll(`.job-btn[data-relic="${relicType}"]`).forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.job === jobId);
    });

    // Render tracking stages
    const data = this.getRelicData(relicType);
    const stagesContainer = document.getElementById(`tracking-stages-${relicType}`);
    if (stagesContainer && data) {
      stagesContainer.innerHTML = this.renderTrackingStages(relicType, data);
    }

    // Save setting
    const settings = Storage.getSettings();
    settings.lastSelectedJobs = settings.lastSelectedJobs || {};
    settings.lastSelectedJobs[relicType] = jobId;
    Storage.saveSettings(settings);
  },

  // Toggle stage expansion
  toggleStage(stageKey) {
    const card = document.querySelector(`[data-stage-key="${stageKey}"]`);
    if (!card) return;

    const content = card.querySelector('.stage-content');
    if (!content) return;

    if (this.state.expandedStages.has(stageKey)) {
      this.state.expandedStages.delete(stageKey);
      card.classList.remove('expanded');
      content.style.display = 'none';
    } else {
      this.state.expandedStages.add(stageKey);
      card.classList.add('expanded');
      content.style.display = '';
    }
  },

  // Expand all stages
  expandAllStages(relicType) {
    document.querySelectorAll(`#tracking-stages-${relicType} .stage-card`).forEach(card => {
      const key = card.dataset.stageKey;
      this.state.expandedStages.add(key);
      card.classList.add('expanded');
      const content = card.querySelector('.stage-content');
      if (content) content.style.display = '';
    });
  },

  // Collapse all stages
  collapseAllStages(relicType) {
    document.querySelectorAll(`#tracking-stages-${relicType} .stage-card`).forEach(card => {
      const key = card.dataset.stageKey;
      this.state.expandedStages.delete(key);
      card.classList.remove('expanded');
      const content = card.querySelector('.stage-content');
      if (content) content.style.display = 'none';
    });
  },

  // Toggle material completion
  toggleMaterial(relicType, jobId, stageId, materialId, required) {
    Storage.toggleMaterialComplete(relicType, jobId, stageId, materialId, required);
    this.refreshTrackingView(relicType);
  },

  // Adjust material quantity
  adjustQuantity(relicType, jobId, stageId, materialId, delta, max) {
    Storage.adjustMaterialQuantity(relicType, jobId, stageId, materialId, delta, max);
    this.refreshTrackingView(relicType);
  },

  // Refresh tracking view
  refreshTrackingView(relicType) {
    const data = this.getRelicData(relicType);
    const stagesContainer = document.getElementById(`tracking-stages-${relicType}`);

    if (stagesContainer && data && this.state.selectedJob) {
      stagesContainer.innerHTML = this.renderTrackingStages(relicType, data);
    }

    // Also update job selector to refresh progress percentages
    const jobSelector = document.querySelector(`#view-${relicType} .job-selector`);
    if (jobSelector) {
      jobSelector.outerHTML = this.renderJobSelector(relicType);
    }
  },

  // Refresh current view
  refreshCurrentView() {
    this.renderContent(this.state.currentTab);
  },

  // Confirm and reset job progress
  confirmResetJob(relicType, jobId) {
    const jobInfo = getJobInfo(jobId);
    if (confirm(`確定要重置 ${jobInfo?.name || jobId} 的所有進度嗎？此操作無法撤銷。`)) {
      Storage.resetJobProgress(relicType, jobId);
      this.refreshTrackingView(relicType);
      this.showToast('進度已重置');
    }
  },

  // Show toast notification
  showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  },

  // Bind event handlers
  bindEvents() {
    // Tab clicks
    document.getElementById('tab-nav').addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (btn) {
        this.switchTab(btn.dataset.tab);
      }
    });

    // Job clicks - use event delegation on main container
    document.querySelector('.main-container').addEventListener('click', (e) => {
      const btn = e.target.closest('.job-btn');
      if (btn) {
        const relicType = btn.dataset.relic;
        const jobId = btn.dataset.job;
        this.selectJob(relicType, jobId);
      }
    });
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UI;
}
