import { getFile } from '../utils/api.js';

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('curseforge.com/minecraft')) {
    chrome.tabs.sendMessage(tabId, { text: 'reload' });
  }
});

const download = async (mod) => {
  try {
    const config = await chrome.storage.sync.get(['game-version', 'mod-loader', 'api-key']);
    // Validate configuration
    if (!config) {
      throw new Error('Please configure the extension first');
    }
    if (!config['api-key']) {
      throw new Error('Please configure the API key first');
    }
    if (!config['game-version'] || !config['mod-loader']) {
      throw new Error('Please configure the game version and mod loader first');
    }
    // Download mod
    const file = await getFile(
      mod.slug,
      config['game-version'],
      config['mod-loader'],
      config['api-key'],
    );
    const downloadId = await chrome.downloads.download({
      url: file.downloadUrl,
      filename: file.fileName,
      saveAs: false,
    });

    // Save download history
    const downloadList = (await chrome.storage.local.get('download-list'))['download-list'] || [];
    downloadList.push({ ...mod, downloadId, status: 'Downloading' });
    await chrome.storage.local.set({ 'download-list': downloadList });
  } catch (error) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '../images/icon.png',
      title: 'Error',
      message: error.message,
    });
  }
};

chrome.runtime.onMessage.addListener((message) => {
  if (message.text === 'download') {
    download(message.mod);
  }
});

chrome.notifications.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

chrome.downloads.onChanged.addListener((delta) => {
  let status = '';
  if (delta.state && delta.state.current === 'complete') {
    status = 'Downloaded';
  }
  if (delta.state && delta.state.current === 'interrupted') {
    status = 'Canceled';
  }
  if (delta.exists && delta.exists.current === false) {
    status = 'Removed';
  }

  if (status) {
    chrome.storage.local.get('download-list', (result) => {
      const downloadList = result['download-list'];
      const index = downloadList.findIndex((item) => item.downloadId === delta.id);
      if (index !== -1) {
        switch (status) {
          case 'Downloaded':
            downloadList[index].status = 'Downloaded';
            break;
          case 'Canceled':
          case 'Removed':
            downloadList.splice(index, 1);
            break;
          default:
            break;
        }
        chrome.storage.local.set({ 'download-list': downloadList });
        chrome.runtime.sendMessage({ text: 'download-list-updated' });
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { text: 'reload' });
        });
      }
    });
  }
});
