// UI Rendering Module for FF14 Relic Tracker
// 重新設計的 UI - 以快速參考為核心

const UI = {
  // Current state
  state: {
    currentTab: 'zodiac',
    currentMode: 'reference', // 'reference' or 'tracking'
    selectedJob: null,
    collapsedStages: new Set(),
    includeOptional: false // 是否計算可選詩學項目
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
    if (settings.includeOptional !== undefined) {
      this.state.includeOptional = settings.includeOptional;
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
      { id: 'skysteel', name: '天鋼', version: '5.0' }
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

    // Skysteel uses a unified view (reference + tracking combined)
    const isSkysteel = relicType === 'skysteel';
    const html = `
      ${this.renderRelicHeader(data)}
      ${!isSkysteel ? this.renderMaterialSummary(data) : ''}
      ${!isSkysteel ? this.renderModeToggle(relicType) : ''}
      <div id="view-${relicType}">
        ${isSkysteel
          ? this.renderSkysteelReferenceView(data)
          : (this.state.currentMode === 'tracking'
            ? this.renderTrackingView(relicType, data)
            : this.renderReferenceView(relicType, data))}
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

    // Collect all materials with hierarchy preserved
    const allMaterials = [];
    let requiredTomestone = 0;  // 必需的詩學
    let optionalTomestone = 0;  // 可選的詩學（有其他獲取方式）
    let requiredMilitary = 0;   // 必需的軍票
    let optionalMilitary = 0;   // 可選的軍票（有其他獲取方式）

    // Helper to parse military seals from source string
    const parseMilitary = (source, quantity) => {
      if (!source) return 0;
      // Match patterns like "軍票 5000", "軍票5000", "軍票 20000×4"
      const match = source.match(/軍票\s*(\d+)/);
      if (match) {
        return parseInt(match[1]) * quantity;
      }
      return 0;
    };

    // Helper to collect materials
    const collectMaterials = (materials, multiplier = 1) => {
      if (!Array.isArray(materials)) return;
      materials.forEach(mat => {
        const qty = mat.quantity * multiplier;
        const tom = (mat.tomestone || 0) * multiplier;
        const mil = parseMilitary(mat.source, qty);
        const isOptional = mat.optional === true;

        // Separate required vs optional tomestone and military
        if (isOptional) {
          optionalTomestone += tom;
          optionalMilitary += mil;
        } else {
          requiredTomestone += tom;
          requiredMilitary += mil;
        }

        const item = {
          name: mat.name,
          quantity: qty,
          source: mat.source || '',
          sourceType: this.getSourceType(mat.source || ''),
          tomestone: tom,
          military: mil,
          optional: isOptional,
          note: mat.note || '',
          subMaterials: []
        };

        // Process sub-materials
        // Note: sub-material quantity is TOTAL for the parent item, not per-parent
        // So we DON'T multiply by qty, just use sub.quantity directly
        if (mat.subMaterials && Array.isArray(mat.subMaterials)) {
          mat.subMaterials.forEach(sub => {
            const subQty = sub.quantity;
            const subTom = (sub.tomestone || 0) * sub.quantity;
            const subMil = parseMilitary(sub.source, subQty);
            const subOptional = sub.optional === true;

            if (subOptional) {
              optionalTomestone += subTom;
              optionalMilitary += subMil;
            } else {
              requiredTomestone += subTom;
              requiredMilitary += subMil;
            }

            item.subMaterials.push({
              name: sub.name,
              quantity: subQty,
              source: sub.source || '',
              sourceType: this.getSourceType(sub.source || ''),
              tomestone: subTom,
              military: subMil,
              optional: subOptional,
              note: sub.note || ''
            });
          });
        }

        allMaterials.push(item);
      });
    };

    // Add stage materials
    data.stages.forEach(stage => {
      if (!stage.materials) return;
      let materials = stage.materials;
      if (Array.isArray(stage.materials.crafters)) {
        materials = stage.materials.crafters[0]?.materials || [];
      }
      collectMaterials(materials);
    });

    // Add prerequisite materials (for aetherial)
    if (data.prerequisiteMaterials) {
      data.prerequisiteMaterials.forEach(section => {
        collectMaterials(section.materials);
      });
    }

    // Add shared materials
    if (data.sharedMaterials) {
      data.sharedMaterials.forEach(section => {
        collectMaterials(section.materials);
      });
    }

    if (allMaterials.length === 0) return '';

    // Sort: items with subMaterials (crafted items) go to the end
    allMaterials.sort((a, b) => {
      const aHasSub = a.subMaterials.length > 0 ? 1 : 0;
      const bHasSub = b.subMaterials.length > 0 ? 1 : 0;
      return aHasSub - bHasSub;
    });

    // Count total unique materials (including sub-materials)
    let totalCount = allMaterials.length;
    allMaterials.forEach(m => { totalCount += m.subMaterials.length; });

    // Render a single material row
    const renderRow = (mat, isSubMaterial = false, hasChildren = false) => {
      let tooltipParts = [];
      if (mat.tomestone) tooltipParts.push(`詩學消耗: ${mat.tomestone}`);
      if (mat.source) tooltipParts.push(`來源: ${mat.source}`);
      if (mat.note && mat.note.trim()) tooltipParts.push(mat.note.trim());
      const hasTooltip = tooltipParts.length > 0;
      const tooltipText = tooltipParts.join('&#10;').replace(/"/g, '&quot;').replace(/\n/g, '&#10;');

      const classes = [
        'summary-row',
        `source-${mat.sourceType}`,
        isSubMaterial ? 'sub-material' : '',
        hasChildren ? 'has-children' : '',
        hasTooltip ? 'has-tooltip' : ''
      ].filter(Boolean).join(' ');

      return `
        <div class="${classes}"
             ${hasTooltip ? `data-tooltip="${tooltipText}"` : ''}>
          <span class="summary-name">${isSubMaterial ? '└ ' : ''}${mat.name}${this.renderSearchBtn(mat.name)}</span>
          <span class="summary-qty">×${mat.quantity}</span>
          <span class="summary-source">${this.getShortSource(mat.source)}</span>
        </div>
      `;
    };

    // Calculate displayed totals based on toggle
    const includeOptional = this.state.includeOptional;
    const displayedTomestone = includeOptional
      ? requiredTomestone + optionalTomestone
      : requiredTomestone;
    const displayedMilitary = includeOptional
      ? requiredMilitary + optionalMilitary
      : requiredMilitary;
    const hasOptional = optionalTomestone > 0 || optionalMilitary > 0;
    const hasOptionalMilitary = optionalMilitary > 0;

    return `
      <details class="material-summary-compact" open>
        <summary class="summary-header">
          <span class="summary-title-text">材料總覽</span>
          <span class="summary-totals">
            ${displayedTomestone > 0 || hasOptional ? `
              <span class="summary-tomestone">
                ${this.getSourceIcon('tomestone')} 詩學: ${displayedTomestone.toLocaleString()}
                ${hasOptional && !includeOptional && optionalTomestone > 0 ? `<span class="optional-hint">（+${optionalTomestone.toLocaleString()} 可選）</span>` : ''}
              </span>
            ` : ''}
            ${displayedMilitary > 0 || hasOptionalMilitary ? `
              <span class="summary-military">
                ${this.getSourceIcon('military')} 軍票: ${displayedMilitary.toLocaleString()}
                ${hasOptionalMilitary && !includeOptional ? `<span class="optional-hint">（+${optionalMilitary.toLocaleString()} 可選）</span>` : ''}
              </span>
            ` : ''}
          </span>
          <span class="summary-count">${totalCount} 種材料</span>
        </summary>
        ${hasOptional ? `
          <div class="summary-options">
            <label class="option-toggle">
              <input type="checkbox"
                     ${includeOptional ? 'checked' : ''}
                     onchange="UI.toggleOptionalTomestone()">
              <span>計算可用其他方式獲得的詩學項目</span>
              <span class="option-hint">（如每週任務、刷副本可免費獲得的材料）</span>
            </label>
          </div>
        ` : ''}
        <div class="summary-table">
          ${allMaterials.map(mat => {
            const hasChildren = mat.subMaterials.length > 0;
            let html = renderRow(mat, false, hasChildren);
            // Render sub-materials indented
            if (hasChildren) {
              html += mat.subMaterials.map(sub => renderRow(sub, true, false)).join('');
            }
            return html;
          }).join('')}
        </div>
      </details>
    `;
  },

  // Source icon URLs from XIVAPI
  sourceIcons: {
    tomestone: 'https://xivapi.com/i/065000/065023.png',
    military: 'https://xivapi.com/i/065000/065006.png',
    allied: 'https://xivapi.com/i/065000/065024.png',
    gil: 'https://xivapi.com/i/065000/065002.png',
    fate: 'https://xivapi.com/i/061000/061809.png',
    bicolor: 'https://xivapi.com/i/065000/065071.png',
    dungeon: 'https://xivapi.com/i/061000/061801.png',
    raid: 'https://xivapi.com/i/061000/061802.png',
    market: 'https://xivapi.com/i/060000/060993.png',
    craft: 'https://xivapi.com/i/060000/060434.png',
    scrip_purple: 'https://xivapi.com/i/065000/065088.png'
  },

  // Get icon img tag
  getSourceIcon(type) {
    const url = this.sourceIcons[type];
    if (url) {
      return `<img class="source-icon" src="${url}" alt="${type}">`;
    }
    return '';
  },

  // Get short source text for summary with icon (supports multiple sources)
  getShortSource(source) {
    if (!source) return '-';

    // Split by common delimiters
    const parts = source.split(/[\/、]/);
    const results = [];

    parts.forEach(part => {
      const trimmed = part.trim();
      if (!trimmed) return;

      const s = trimmed.toLowerCase();
      let result = null;

      // Match source type and get icon + short label
      if (s.includes('詩學')) {
        result = `${this.getSourceIcon('tomestone')}詩學`;
      } else if (s.includes('天道')) {
        result = `${this.getSourceIcon('tomestone')}天道`;
      } else if (s.includes('博茲雅')) {
        result = `${this.getSourceIcon('fate')}博茲雅`;
      } else if (s.includes('扎杜諾爾')) {
        result = `${this.getSourceIcon('fate')}扎杜諾爾`;
      } else if (s.includes('優雷卡') || s.includes('eureka')) {
        result = `${this.getSourceIcon('fate')}優雷卡`;
      } else if (s.includes('新月島')) {
        result = `${this.getSourceIcon('fate')}新月島`;
      } else if (s.match(/a\d+s/) || s.includes('亞歷山大') || s.includes('歐米茄') || s.includes('伊甸')) {
        result = `${this.getSourceIcon('raid')}8人本`;
      } else if (s.includes('24人')) {
        result = `${this.getSourceIcon('raid')}24人本`;
      } else if (s.includes('ba') || s.includes('女王古殿') || s.includes('死宮')) {
        result = `${this.getSourceIcon('raid')}特殊副本`;
      } else if (s.includes('fate')) {
        result = `${this.getSourceIcon('fate')}FATE`;
      } else if (s.includes('nm') || s.includes('掉落') || s.includes('ce')) {
        result = `${this.getSourceIcon('fate')}NM`;
      } else if (s.includes('副本') || s.match(/\d+級/)) {
        result = `${this.getSourceIcon('dungeon')}副本`;
      } else if (s.includes('製作') || s.includes('合成')) {
        result = `${this.getSourceIcon('craft')}製作`;
      } else if (s.includes('市場') || s.includes('購買')) {
        result = `${this.getSourceIcon('market')}市場`;
      } else if (s.includes('軍票')) {
        result = `${this.getSourceIcon('military')}軍票`;
      } else if (s.includes('同盟徽章')) {
        result = `${this.getSourceIcon('allied')}同盟徽章`;
      } else if (s.includes('雜用商人') || s.includes('金幣') || s.match(/\d+g/)) {
        result = `${this.getSourceIcon('gil')}金幣`;
      } else if (s.includes('寶石') || s.includes('雙色')) {
        result = `${this.getSourceIcon('bicolor')}寶石`;
      } else if (s.includes('挖寶') || s.includes('地圖')) {
        result = `${this.getSourceIcon('fate')}挖寶`;
      } else if (s.includes('水晶') && s.includes('兌換')) {
        result = `${this.getSourceIcon('fate')}水晶兌換`;
      } else if (s.includes('兌換')) {
        result = `${this.getSourceIcon('tomestone')}兌換`;
      } else if (s.includes('古武')) {
        result = `${this.getSourceIcon('dungeon')}古武`;
      } else {
        // Fallback: use first 6 chars
        result = trimmed.substring(0, 6);
      }

      // Avoid duplicates
      if (result && !results.includes(result)) {
        results.push(result);
      }
    });

    return results.length > 0 ? results.join(' ') : '-';
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

  // Toggle optional tomestone calculation
  toggleOptionalTomestone() {
    this.state.includeOptional = !this.state.includeOptional;
    Storage.saveSettings({ includeOptional: this.state.includeOptional });
    // Re-render current content to update totals
    this.renderContent(this.state.currentTab);
  },

  // Render reference view - all stages expanded, no job selection needed
  renderReferenceView(relicType, data) {
    if (!data.stages) return '<p>無階段數據</p>';

    if (relicType === 'skysteel') {
      return this.renderSkysteelReferenceView(data);
    }

    return `
      ${this.renderPrerequisiteMaterials(data)}
      <div class="stages-timeline">
        ${data.stages.map((stage, index) => {
          return this.renderStageCard(stage, index + 1, stage.materials, false, relicType, null);
        }).join('')}
      </div>
      ${this.renderSharedMaterials(data)}
    `;
  },

  // Render skysteel unified view - grouped by patch with tables + tracking checkboxes
  renderSkysteelReferenceView(data) {
    const stages = data.stages;

    // Load progress for all jobs
    const progress = {};
    const allJobs = [
      ...(stages[1]?.materials?.crafters || []).map(j => j.job),
      ...(stages[1]?.materials?.gatherers || []).map(j => j.job)
    ];
    allJobs.forEach(jobId => {
      progress[jobId] = Storage.getJobProgress('skysteel', jobId);
    });

    let html = '<div class="skysteel-reference">';

    // Group 1: Base tool (quest only)
    html += `
      <div class="skysteel-group">
        <div class="skysteel-group-header">
          <span class="patch-badge">版本 5.1</span>
          <span class="skysteel-group-title">${stages[0].name} <span class="stage-ilvl">iLv ${stages[0].ilvl}</span></span>
        </div>
        <ul class="skysteel-notes">
          <li>完成任務「${stages[0].quest}」，使用任務獎勵的天鋼工具箱後可獲得相應職業的專用工具（主手）。</li>
          <li>第二把及以上的專用工具可在德尼斯（伊修加爾德下層 X:8, Y:10.1）處花費 ${this.getSourceIcon('gil')}80,000 金幣購買。</li>
          <li>在獲取到第一把天鋼工具後，製作筆記會在支線任務條目下追加天鋼工具的特殊配方。</li>
        </ul>
      </div>
    `;

    // Group 2: 5.25 - Stages 2+3
    html += this.renderSkysteelPairedGroup(
      '5.25', `${stages[1].name} <span class="stage-ilvl">iLv ${stages[1].ilvl}</span> 與${stages[2].name} <span class="stage-ilvl">iLv ${stages[2].ilvl}</span>`,
      stages[1], stages[2], progress,
      [
        `強化至${stages[1].name}需要20個工票素材和普通素材A，強化至${stages[2].name}需要30個工票素材和普通素材B。`,
        '製作必須主手裝備對應的工具才能進行，不對副手進行限制。',
        '（90級或以上）製作時可以使用「工匠的神速技巧」。',
        `工票素材需要使用 ${this.getSourceIcon('scrip_purple')}20 巧手紫票在任意工票交易處兌換，或從市場購買。`
      ]
    );

    // Group 3: 5.35 - Stages 4+5
    html += this.renderSkysteelPairedGroup(
      '5.35', `${stages[3].name} <span class="stage-ilvl">iLv ${stages[3].ilvl}</span> 與${stages[4].name} <span class="stage-ilvl">iLv ${stages[4].ilvl}</span>`,
      stages[3], stages[4], progress,
      [
        `強化至${stages[3].name}需要工票素材×18（收藏品，依收藏價值決定數量）＋普通素材×36。`,
        `強化至${stages[4].name}需要工票素材×21＋普通素材×21。`,
        '工票素材為收藏品製作交納，用巧手紫票或蒼天街振興票兌換材料。',
        '收藏品價值越高，每次交納獲得的進度越多，18為最高收藏價值時的最低需求數量。'
      ]
    );

    // Group 4: 5.45 - Stage 6
    html += this.renderSkysteelSingleGroup(
      '5.45', `${stages[5].name} <span class="stage-ilvl">iLv ${stages[5].ilvl}</span>`, stages[5], progress,
      [
        '工票素材×20＋蒼天街空島素材各×100。此階段為高難度配方。',
        '工票素材用巧手紫票或蒼天街振興票兌換。',
        '空島素材可在蒼天街雲冠群島（空島）採集獲得。'
      ]
    );

    html += '</div>';
    return html;
  },

  // Check if a skysteel material is complete
  isSkysteelMatComplete(progress, jobId, stageId, matIdx, qty) {
    const matId = `${stageId}_${matIdx}`;
    return (progress[jobId]?.[stageId]?.[matId] || 0) >= qty;
  },

  // Render a copy button for material name
  renderCopyBtn(matName) {
    const escaped = matName.replace(/'/g, "\\'");
    return `<button class="skysteel-copy-btn" onclick="event.preventDefault();event.stopPropagation();navigator.clipboard.writeText('${escaped}');UI.showToast('已複製：${escaped}')" title="複製名稱"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>`;
  },

  // Render a search button that links to the item search site
  renderSearchBtn(matName) {
    const lookupName = matName.replace(/HQ$/, '');
    const itemId = typeof ITEM_NAME_TO_ID !== 'undefined' && ITEM_NAME_TO_ID[lookupName];
    if (!itemId) return '';
    return `<a class="search-btn" href="https://cycleapple.github.io/ffxiv-item-search-tc/item/${itemId}" target="_blank" rel="noopener noreferrer" title="前往物品搜尋站" onclick="event.stopPropagation()"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></a>`;
  },

  // Render a checkbox cell for skysteel
  renderSkysteelCell(jobId, stageId, matIdx, matName, qty, isComplete) {
    const matId = `${stageId}_${matIdx}`;
    return `
      <td class="skysteel-mat-cell ${isComplete ? 'skysteel-done' : ''}">
        <label class="skysteel-check">
          <input type="checkbox" ${isComplete ? 'checked' : ''}
                 onchange="UI.toggleSkysteelMat('${jobId}','${stageId}','${matId}',${qty})">
          <span>${matName} ×${qty}</span>
        </label>${this.renderCopyBtn(matName)}${this.renderSearchBtn(matName)}
      </td>`;
  },

  // Render a combined scrip checkbox cell (marks two stages at once)
  renderSkysteelScripCell(jobId, stageAId, qtyA, stageBId, qtyB, matName, totalQty, bothComplete) {
    const matAId = `${stageAId}_0`;
    const matBId = `${stageBId}_0`;
    return `
      <td class="skysteel-mat-cell ${bothComplete ? 'skysteel-done' : ''}">
        <label class="skysteel-check">
          <input type="checkbox" ${bothComplete ? 'checked' : ''}
                 onchange="UI.toggleSkysteelScripPair('${jobId}','${stageAId}','${matAId}',${qtyA},'${stageBId}','${matBId}',${qtyB})">
          <span>${matName} ×${totalQty}</span>
        </label>${this.renderCopyBtn(matName)}${this.renderSearchBtn(matName)}
      </td>`;
  },

  // Toggle a single skysteel material
  toggleSkysteelMat(jobId, stageId, matId, qty) {
    Storage.toggleMaterialComplete('skysteel', jobId, stageId, matId, qty);
    this.renderContent('skysteel');
  },

  // Toggle a paired scrip material (both stages at once)
  toggleSkysteelScripPair(jobId, stageAId, matAId, qtyA, stageBId, matBId, qtyB) {
    const progress = Storage.getJobProgress('skysteel', jobId);
    const aOk = (progress[stageAId]?.[matAId] || 0) >= qtyA;
    const bOk = (progress[stageBId]?.[matBId] || 0) >= qtyB;

    if (aOk && bOk) {
      // Uncheck both
      Storage.updateMaterialProgress('skysteel', jobId, stageAId, matAId, 0);
      Storage.updateMaterialProgress('skysteel', jobId, stageBId, matBId, 0);
    } else {
      // Check both
      if (!aOk) Storage.updateMaterialProgress('skysteel', jobId, stageAId, matAId, qtyA);
      if (!bOk) Storage.updateMaterialProgress('skysteel', jobId, stageBId, matBId, qtyB);
    }
    this.renderContent('skysteel');
  },

  // Toggle all materials for a job in a skysteel group
  toggleSkysteelRow(jobId, matsJson) {
    const mats = JSON.parse(matsJson);
    const progress = Storage.getJobProgress('skysteel', jobId);
    const allDone = mats.every(m => (progress[m.stageId]?.[m.matId] || 0) >= m.qty);

    mats.forEach(m => {
      Storage.updateMaterialProgress('skysteel', jobId, m.stageId, m.matId, allDone ? 0 : m.qty);
    });
    this.renderContent('skysteel');
  },

  // Render a paired skysteel group (two stages combined into one table)
  renderSkysteelPairedGroup(patch, title, stageA, stageB, progress, notes) {
    let html = `
      <div class="skysteel-group">
        <div class="skysteel-group-header">
          <span class="patch-badge">版本 ${patch}</span>
          <span class="skysteel-group-title">${title}</span>
        </div>
        <ul class="skysteel-notes">
          ${notes.map(n => `<li>${n}</li>`).join('')}
        </ul>
    `;

    // Crafters table
    if (stageA.materials?.crafters) {
      html += `<table class="skysteel-table"><thead><tr>
        <th></th><th>能工巧匠</th><th>工票素材（合計）</th><th>普通素材A</th><th>普通素材B</th>
      </tr></thead><tbody>`;

      stageA.materials.crafters.forEach((jobA, i) => {
        const jobB = stageB.materials.crafters[i];
        const jobId = jobA.job;
        const jobInfo = getJobInfo(jobId);
        const scripA = jobA.materials[0];
        const scripB = jobB.materials[0];
        const normalA = jobA.materials[1];
        const normalB = jobB.materials[1];
        const totalScrip = scripA.quantity + scripB.quantity;

        const scripAOk = this.isSkysteelMatComplete(progress, jobId, stageA.id, 0, scripA.quantity);
        const scripBOk = this.isSkysteelMatComplete(progress, jobId, stageB.id, 0, scripB.quantity);
        const normalAOk = this.isSkysteelMatComplete(progress, jobId, stageA.id, 1, normalA.quantity);
        const normalBOk = this.isSkysteelMatComplete(progress, jobId, stageB.id, 1, normalB.quantity);
        const allDone = scripAOk && scripBOk && normalAOk && normalBOk;

        // Build row mats for row toggle
        const rowMats = JSON.stringify([
          { stageId: stageA.id, matId: `${stageA.id}_0`, qty: scripA.quantity },
          { stageId: stageB.id, matId: `${stageB.id}_0`, qty: scripB.quantity },
          { stageId: stageA.id, matId: `${stageA.id}_1`, qty: normalA.quantity },
          { stageId: stageB.id, matId: `${stageB.id}_1`, qty: normalB.quantity }
        ]).replace(/"/g, '&quot;');

        html += `<tr class="${allDone ? 'skysteel-row-done' : ''}">
          <td class="skysteel-row-check">
            <input type="checkbox" ${allDone ? 'checked' : ''}
                   onchange="UI.toggleSkysteelRow('${jobId}','${rowMats}')"
                   title="全選/取消全選">
          </td>
          <td class="skysteel-job-cell">${jobInfo ? `<img class="job-icon-sm" src="${jobInfo.icon}" alt="${jobInfo.name}">` : ''}${jobInfo?.name || jobId}</td>
          ${this.renderSkysteelScripCell(jobId, stageA.id, scripA.quantity, stageB.id, scripB.quantity, scripA.name, totalScrip, scripAOk && scripBOk)}
          ${this.renderSkysteelCell(jobId, stageA.id, 1, normalA.name, normalA.quantity, normalAOk)}
          ${this.renderSkysteelCell(jobId, stageB.id, 1, normalB.name, normalB.quantity, normalBOk)}
        </tr>`;
      });

      html += '</tbody></table>';
    }

    // Gatherers table
    if (stageA.materials?.gatherers) {
      html += `<table class="skysteel-table"><thead><tr>
        <th></th><th>大地使者</th><th>${stageA.name}素材</th><th>${stageB.name}素材</th>
      </tr></thead><tbody>`;

      stageA.materials.gatherers.forEach((jobA, i) => {
        const jobB = stageB.materials.gatherers[i];
        const jobId = jobA.job;
        const jobInfo = getJobInfo(jobId);

        // Check completion for all materials in both stages
        const allMatsA = jobA.materials.map((m, idx) => ({
          stageId: stageA.id, matId: `${stageA.id}_${idx}`, qty: m.quantity,
          done: this.isSkysteelMatComplete(progress, jobId, stageA.id, idx, m.quantity)
        }));
        const allMatsB = jobB.materials.map((m, idx) => ({
          stageId: stageB.id, matId: `${stageB.id}_${idx}`, qty: m.quantity,
          done: this.isSkysteelMatComplete(progress, jobId, stageB.id, idx, m.quantity)
        }));
        const allDoneA = allMatsA.every(m => m.done);
        const allDoneB = allMatsB.every(m => m.done);
        const allDone = allDoneA && allDoneB;

        const rowMats = JSON.stringify([...allMatsA, ...allMatsB].map(m => ({
          stageId: m.stageId, matId: m.matId, qty: m.qty
        }))).replace(/"/g, '&quot;');

        html += `<tr class="${allDone ? 'skysteel-row-done' : ''}">
          <td class="skysteel-row-check">
            <input type="checkbox" ${allDone ? 'checked' : ''}
                   onchange="UI.toggleSkysteelRow('${jobId}','${rowMats}')"
                   title="全選/取消全選">
          </td>
          <td class="skysteel-job-cell">${jobInfo ? `<img class="job-icon-sm" src="${jobInfo.icon}" alt="${jobInfo.name}">` : ''}${jobInfo?.name || jobId}</td>
          <td class="${allDoneA ? 'skysteel-done' : ''}">${jobA.materials.map((m, idx) => {
            const done = allMatsA[idx].done;
            return `<label class="skysteel-check"><input type="checkbox" ${done ? 'checked' : ''} onchange="UI.toggleSkysteelMat('${jobId}','${stageA.id}','${stageA.id}_${idx}',${m.quantity})"><span>${m.name} ×${m.quantity}</span></label>${this.renderCopyBtn(m.name)}${this.renderSearchBtn(m.name)}`;
          }).join('<br>')}</td>
          <td class="${allDoneB ? 'skysteel-done' : ''}">${jobB.materials.map((m, idx) => {
            const done = allMatsB[idx].done;
            return `<label class="skysteel-check"><input type="checkbox" ${done ? 'checked' : ''} onchange="UI.toggleSkysteelMat('${jobId}','${stageB.id}','${stageB.id}_${idx}',${m.quantity})"><span>${m.name} ×${m.quantity}</span></label>${this.renderCopyBtn(m.name)}${this.renderSearchBtn(m.name)}`;
          }).join('<br>')}</td>
        </tr>`;
      });

      html += '</tbody></table>';
    }

    html += '</div>';
    return html;
  },

  // Render a single skysteel group (one stage as table)
  renderSkysteelSingleGroup(patch, title, stage, progress, notes) {
    let html = `
      <div class="skysteel-group">
        <div class="skysteel-group-header">
          <span class="patch-badge">版本 ${patch}</span>
          <span class="skysteel-group-title">${title}</span>
        </div>
        <ul class="skysteel-notes">
          ${notes.map(n => `<li>${n}</li>`).join('')}
        </ul>
    `;

    // Crafters table
    if (stage.materials?.crafters) {
      html += `<table class="skysteel-table"><thead><tr>
        <th></th><th>能工巧匠</th><th>工票素材</th><th>空島素材A</th><th>空島素材B</th>
      </tr></thead><tbody>`;

      stage.materials.crafters.forEach(job => {
        const jobId = job.job;
        const jobInfo = getJobInfo(jobId);
        const mats = job.materials;

        const matStates = mats.map((m, idx) => ({
          done: this.isSkysteelMatComplete(progress, jobId, stage.id, idx, m.quantity)
        }));
        const allDone = matStates.every(s => s.done);

        const rowMats = JSON.stringify(mats.map((m, idx) => ({
          stageId: stage.id, matId: `${stage.id}_${idx}`, qty: m.quantity
        }))).replace(/"/g, '&quot;');

        html += `<tr class="${allDone ? 'skysteel-row-done' : ''}">
          <td class="skysteel-row-check">
            <input type="checkbox" ${allDone ? 'checked' : ''}
                   onchange="UI.toggleSkysteelRow('${jobId}','${rowMats}')"
                   title="全選/取消全選">
          </td>
          <td class="skysteel-job-cell">${jobInfo ? `<img class="job-icon-sm" src="${jobInfo.icon}" alt="${jobInfo.name}">` : ''}${jobInfo?.name || jobId}</td>
          ${mats.map((m, idx) => this.renderSkysteelCell(jobId, stage.id, idx, m.name, m.quantity, matStates[idx].done)).join('')}
        </tr>`;
      });

      html += '</tbody></table>';
    }

    // Gatherers table
    if (stage.materials?.gatherers) {
      html += `<table class="skysteel-table"><thead><tr>
        <th></th><th>大地使者</th><th colspan="${stage.materials.gatherers[0]?.materials.length || 1}">素材</th>
      </tr></thead><tbody>`;

      stage.materials.gatherers.forEach(job => {
        const jobId = job.job;
        const jobInfo = getJobInfo(jobId);

        const matStates = job.materials.map((m, idx) => ({
          done: this.isSkysteelMatComplete(progress, jobId, stage.id, idx, m.quantity)
        }));
        const allDone = matStates.every(s => s.done);

        const rowMats = JSON.stringify(job.materials.map((m, idx) => ({
          stageId: stage.id, matId: `${stage.id}_${idx}`, qty: m.quantity
        }))).replace(/"/g, '&quot;');

        html += `<tr class="${allDone ? 'skysteel-row-done' : ''}">
          <td class="skysteel-row-check">
            <input type="checkbox" ${allDone ? 'checked' : ''}
                   onchange="UI.toggleSkysteelRow('${jobId}','${rowMats}')"
                   title="全選/取消全選">
          </td>
          <td class="skysteel-job-cell">${jobInfo ? `<img class="job-icon-sm" src="${jobInfo.icon}" alt="${jobInfo.name}">` : ''}${jobInfo?.name || jobId}</td>
          ${job.materials.map((m, idx) => this.renderSkysteelCell(jobId, stage.id, idx, m.name, m.quantity, matStates[idx].done)).join('')}
        </tr>`;
      });

      html += '</tbody></table>';
    }

    html += '</div>';
    return html;
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
    const isExpanded = !isTracking || !this.state.collapsedStages.has(stageKey);
    const isComplete = stageProgress && stageProgress.percentage === 100;

    return `
      <div class="stage-card ${isExpanded ? 'expanded' : ''} ${isComplete ? 'completed' : ''}"
           data-step="${stepNumber}"
           data-stage-key="${stageKey}">
        <div class="stage-header" onclick="UI.toggleStage('${stageKey}')">
          <div class="stage-main-info">
            <div class="stage-name-wrapper">
              ${isTracking && materials && materials.length > 0 ? `
                <input type="checkbox" class="stage-checkbox"
                       ${isComplete ? 'checked' : ''}
                       onclick="event.stopPropagation(); UI.toggleStageComplete('${relicType}', '${jobId}', '${stage.id}')"
                       title="全選/取消全選此階段">
              ` : ''}
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
                <div class="mat-name">${mat.name} <span class="text-muted">×${mat.quantity}</span>${this.renderSearchBtn(mat.name)}</div>
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
    if (s.includes('軍票')) return 'military';
    if (s.includes('同盟徽章')) return 'allied';
    if (s.includes('雜用商人') || s.includes('100000g')) return 'gil';
    if (s.includes('fate')) return 'fate';
    if (s.includes('24人') || s.includes('raid') || s.includes('歐米茄')) return 'raid';
    if (s.includes('副本') || s.includes('dungeon') || s.includes('級')) return 'dungeon';
    if (s.includes('博茲雅') || s.includes('bozja') || s.includes('扎杜諾爾')) return 'bozja';
    if (s.includes('優雷卡') || s.includes('eureka')) return 'eureka';
    if (s.includes('寶石') || s.includes('雙色')) return 'bicolor';
    if (s.includes('市場') || s.includes('購買')) return 'market';
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
      const iconUrl = this.sourceIcons[type];
      const icon = iconUrl ? `<img class="source-icon" src="${iconUrl}" alt="${type}">` : '';

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

    if (this.state.collapsedStages.has(stageKey)) {
      // Currently collapsed, expand it
      this.state.collapsedStages.delete(stageKey);
      card.classList.add('expanded');
      content.style.display = '';
    } else {
      // Currently expanded, collapse it
      this.state.collapsedStages.add(stageKey);
      card.classList.remove('expanded');
      content.style.display = 'none';
    }
  },

  // Expand all stages
  expandAllStages(relicType) {
    document.querySelectorAll(`#tracking-stages-${relicType} .stage-card`).forEach(card => {
      const key = card.dataset.stageKey;
      this.state.collapsedStages.delete(key);
      card.classList.add('expanded');
      const content = card.querySelector('.stage-content');
      if (content) content.style.display = '';
    });
  },

  // Collapse all stages
  collapseAllStages(relicType) {
    document.querySelectorAll(`#tracking-stages-${relicType} .stage-card`).forEach(card => {
      const key = card.dataset.stageKey;
      this.state.collapsedStages.add(key);
      card.classList.remove('expanded');
      const content = card.querySelector('.stage-content');
      if (content) content.style.display = 'none';
    });
  },

  // Toggle all materials in a stage
  toggleStageComplete(relicType, jobId, stageId) {
    const data = this.getRelicData(relicType);
    if (!data || !data.stages) return;

    const isSkysteel = relicType === 'skysteel';
    const stages = isSkysteel ? this.getSkySteelStages(data.stages, jobId) : data.stages;
    const stage = stages.find(s => s.id === stageId);
    if (!stage || !stage.materials) return;

    Storage.toggleStageComplete(relicType, jobId, stageId, stage.materials);
    this.refreshTrackingView(relicType);
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
