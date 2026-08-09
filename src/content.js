const PLAY_BUTTON_SELECTOR = '[data-testid="playButton"]';
const PLAY_BUTTON_WAIT_MS = 5000;

chrome.runtime.onMessage.addListener((message) => {
  if (message.type !== "close-media-viewer") {
    return;
  }
  history.replaceState(history.state, "", message.url);
  window.dispatchEvent(new PopStateEvent("popstate", { state: history.state }));

  const observer = new MutationObserver(() => {
    const button = document.querySelector(PLAY_BUTTON_SELECTOR);
    if (button === null) {
      return;
    }
    button.click();
    observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(() => observer.disconnect(), PLAY_BUTTON_WAIT_MS);
});
