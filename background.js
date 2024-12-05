chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'takeScreenshot') {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
      sendResponse({ screenshot: dataUrl });
    });
    return true; // Keeps the message channel open for sendResponse
  }
});
