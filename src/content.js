chrome.runtime.onMessage.addListener((message) => {
  if (message.type !== "close-media-viewer") {
    return;
  }
  history.replaceState(history.state, "", message.url);
  window.dispatchEvent(new PopStateEvent("popstate", { state: history.state }));
});
