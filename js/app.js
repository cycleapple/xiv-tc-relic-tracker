// Main Application for FF14 Relic Tracker
// 主應用程式

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('FF14 Relic Tracker - Initializing...');

  // Initialize UI
  UI.init();

  console.log('FF14 Relic Tracker - Ready!');
});

// Global utility functions

// Export progress data
function exportProgress() {
  const data = Storage.exportData();
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `xiv-relic-progress-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();

  URL.revokeObjectURL(url);
  UI.showToast('進度已匯出');
}

// Import progress data
function importProgress() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = Storage.importData(event.target.result);
      if (result) {
        UI.refreshCurrentView();
        UI.showToast('進度已匯入');
      } else {
        UI.showToast('匯入失敗：檔案格式錯誤');
      }
    };
    reader.readAsText(file);
  };

  input.click();
}

// Reset all progress
function resetAllProgress() {
  if (confirm('確定要重置所有進度嗎？此操作無法撤銷。')) {
    if (confirm('真的確定嗎？所有資料將被刪除。')) {
      Storage.resetAllProgress();
      UI.refreshCurrentView();
      UI.showToast('所有進度已重置');
    }
  }
}
