document.getElementById('inject').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
		if (!tab.url.includes("slowroads.io")) {
			alert("This extension only works on slowroads.io!");
			return;
		}
    if (tab?.id) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
        });
				console.log('Script injected');
    }
});

document.getElementById('remove').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	if (!tab.url.includes("slowroads.io")) {
    alert("This extension only works on slowroads.io!");
    return;
  }
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
			if(window.slowRoadsTrackerInterval){
				clearInterval(window.slowRoadsTrackerInterval);
				window.slowRoadsTrackerInterval = null;
				window.slowroadsTrackerStarted = false;
			}
      const el = document.getElementById('slowroads-overlay');
      if (el) el.remove();
    }
  });
});