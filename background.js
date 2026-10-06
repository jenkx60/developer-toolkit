const tools = [
    {
        id: "copy-html",
        title: "Copy HTML",
    },
    {
        id: "copy-css",
        title: "Copy CSS",
    },
    {
        id: "copy-selector",
        title: "Copy Selector",
    },
    {
        id: "copy-image-url",
        title: "Copy Image URL",
    },
    {
        id: "extract-links",
        title: "Extract Links",
    }
];

function createContextMenus() {
    chrome.contextMenus.removeAll(() => {
            chrome.contextMenus.create({
                id: "developer-toolkit",
                title: "Developer Toolkit",
                contexts: ["all"]
            });

        
        tools.forEach((tool) => {
            chrome.contextMenus.create({
                id: tool.id,
                parentId: "developer-toolkit",
                title: tool.title,
                contexts: ["all"]
            });
        });
    });
}

chrome.runtime.onInstalled.addListener(() => {
    createContextMenus();
});

chrome.runtime.onStartup.addListener(() => {
    createContextMenus();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    // console.log("Clicked:", info.menuItemId);
    // console.log("Tab:", tab);
    if (!tab.id) return;

    chrome.storage.local.get(["toolkitEnabled"], (result) => {
        const isEnabled = result.toolkitEnabled ?? true;
        if (!isEnabled) {
            chrome.tabs.sendMessage(tab.id, {
                action: "toolkit-disabled"
            });
            return;
        }
        chrome.tabs.sendMessage(tab.id, {
            action: info.menuItemId
        });
    })
});