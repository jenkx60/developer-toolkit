const toolkitToggle = document.getElementById('toolkit-toggle');

const STORAGE_KEY = 'toolkitEnabled';

// Load the toggle state from storage
chrome.storage.local.get([STORAGE_KEY], (result) => {
    const isEnabled = result[STORAGE_KEY] ?? true;
    toolkitToggle.checked = isEnabled;
});

// Save state when toggle changes
toolkitToggle.addEventListener('change', () => {
    const isEnabled = toolkitToggle.checked;
    chrome.storage.local.set({ [STORAGE_KEY]: isEnabled });
});