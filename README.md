# Developer Toolkit

A lightweight Chrome extension that puts useful frontend development tools directly in the browser's right-click context menu.

Built with **HTML, CSS, vanilla JavaScript, and Chrome Extension Manifest V3**.

> Developer Toolkit is designed as a small, focused developer utility rather than a replacement for Chrome DevTools.

## Features

### Right-click developer tools

- **Copy HTML** — copies the selected element's `outerHTML`.
- **Copy CSS** — extracts useful computed CSS properties from the selected element.
- **Copy Selector** — generates a CSS selector for the selected element and checks for uniqueness.
- **Copy Image URL** — copies the URL of an image under the selected element.
- **Extract Links** — collects unique links from the current page and copies them as a newline-separated list.

### Toolkit toggle

The extension can be turned **ON** or **OFF** from the popup.

When disabled:

- The Developer Toolkit context menu remains visible.
- Developer actions are blocked.
- A toast tells the user to turn the toolkit back on.
- Hover highlighting is disabled.
- The currently displayed highlight is removed.

### Recent copies

The popup is designed to keep the **five most recent copied items**, making it easy to reuse previously copied HTML, CSS, selectors, image URLs, or extracted links.

## Why I built this

Developer Toolkit was built as a practical Chrome Extension project to understand browser extension architecture without relying on a framework.

The project focuses on learning how different extension components communicate:

```text
                    Chrome Browser
                         |
              +----------+----------+
              |                     |
        Context Menu              Popup
              |                     |
              v                     v
        background.js          popup.js
              |                     |
              +----------+----------+
                         |
                  chrome.storage
                         |
                         v
                    content.js
                         |
                 Current Web Page
```

## Architecture

### `manifest.json`

Defines the extension, permissions, content script, service worker, and popup.

### `background.js`

Acts as the extension's service worker.

Responsibilities include:

- Creating the Developer Toolkit context menu.
- Handling context-menu clicks.
- Checking whether the toolkit is enabled.
- Sending tool requests to the content script.

### `content.js`

Runs in the current webpage.

Responsibilities include:

- Tracking the element under the cursor.
- Managing the hover highlight.
- Remembering the selected element.
- Reading DOM information.
- Generating CSS selectors.
- Extracting image URLs.
- Extracting links.
- Copying generated data to the clipboard.
- Showing toast notifications.

### `popup.html`

Contains the extension popup interface.

### `popup.css`

Styles the popup.

### `popup.js`

Controls:

- Toolkit ON/OFF state.
- Recent-copy history.
- Clearing history.

### `chrome.storage.local`

Stores local extension state such as:

- Toolkit enabled/disabled state.
- Recent copy history.

No external database is required.

## Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Chrome Extensions Manifest V3
- Chrome Context Menus API
- Chrome Storage API
- DOM APIs

## Installation for Development

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/developer-toolkit.git
cd developer-toolkit
```

### 2. Open Chrome Extensions

Visit:

```text
chrome://extensions
```

### 3. Enable Developer Mode

Turn on **Developer mode** in the top-right corner.

### 4. Load the extension

Click:

**Load unpacked**

Select the project folder containing `manifest.json`.

### 5. Test

Open a normal webpage and right-click an element.

You should see:

```text
Developer Toolkit
├── Copy HTML
├── Copy CSS
├── Copy Selector
├── Copy Image URL
└── Extract Links
```

## Project Structure

```text
developer-toolkit/
│
├── manifest.json
├── background.js
├── content.js
│
├── popup.html
├── popup.css
├── popup.js
│
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
│
├── README.md
└── PRIVACY.md
```

## Permissions

The extension currently uses the following Chrome permissions:

| Permission | Why it is needed |
|---|---|
| `contextMenus` | Creates the Developer Toolkit right-click menu |
| `activeTab` | Allows interaction with the currently active page |
| `scripting` | Supports extension scripting functionality |
| `storage` | Saves the toolkit state and recent copy history |

The extension also uses a content script on webpages because its core purpose is to inspect the DOM of the page the user is working on.

## Privacy

Developer Toolkit does not send copied content or webpage information to an external server.

Copied content and extension settings are stored locally using Chrome's extension storage.

The extension does not:

- Sell user data.
- Serve advertisements.
- Track browsing history.
- Send webpage content to a remote server.
- Use analytics or third-party tracking services.

For the full privacy policy, see [`PRIVACY.md`](./PRIVACY.md).

## Limitations

Developer Toolkit intentionally keeps its implementation simple.

### Copy CSS

The CSS tool currently reads **computed styles** from the browser. It does not attempt to reconstruct the exact stylesheet rules written by the website author.

### Copy Image URL

The current implementation primarily handles standard `<img>` elements and images contained inside the selected element. CSS background images and more advanced image sources may require additional handling.

### Copy Selector

The selector generator attempts to produce a selector that uniquely identifies the selected element, but extremely dynamic websites can still produce selectors that are less stable than selectors manually written by a developer.

## Roadmap

Potential future improvements:

- [ ] Better CSS extraction
- [ ] CSS background-image URL extraction
- [ ] Better selector generation for dynamic websites
- [ ] Copy text content
- [ ] Copy element dimensions
- [ ] Copy computed typography
- [ ] Extract images
- [ ] Export extracted links
- [ ] Keyboard shortcuts
- [ ] Improved popup history UI
- [ ] Dark mode
- [ ] Settings page
- [ ] Better accessibility
- [ ] Automated tests

## Development Philosophy

The project intentionally avoids frameworks for the extension itself.

The goal is to understand:

- Browser extension architecture
- Content scripts
- Service workers
- Context menus
- Message passing
- DOM manipulation
- Browser storage
- Clipboard APIs
- Event handling
- Chrome extension permissions

before introducing unnecessary abstraction.

## Contributing

Contributions, bug reports, and feature suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature
```

3. Make your changes.
4. Test the extension locally.
5. Commit your changes.

```bash
git commit -m "Add your feature"
```

6. Push the branch.

```bash
git push origin feature/your-feature
```

7. Open a pull request.

## License

This project is open source. Add your preferred license here before publishing the repository.

For example:

```text
MIT License
```

## Author

Built by **Jenkins Uwagbai**.

GitHub: https://github.com/jenkx60
