const MEDIA_VIEWER_PATH_PATTERN = /^(\/[^/]+\/status\/\d+)\/mediaviewer$/i;

chrome.webNavigation.onHistoryStateUpdated.addListener(
  (details) => {
    if (details.frameId !== 0) {
      return;
    }
    const url = new URL(details.url);
    const match = MEDIA_VIEWER_PATH_PATTERN.exec(url.pathname);
    if (match === null) {
      return;
    }

    void chrome.tabs.sendMessage(details.tabId, {
      type: "close-media-viewer",
      url: `${url.origin}${match[1]}/video/1`,
    });
  },
  { url: [{ hostEquals: "x.com" }] },
);
