let selectedElement = null; 
let hoveredElement = null;

// Add extenstion styles when the content script loads
addHighlightStyle();

// Track the hovered element and highlight it
document.addEventListener("mouseover", (event) => {
    hoveredElement = event.target;
    highlightElement(hoveredElement);
});

// Capture the element that was right-clicked
document.addEventListener("contextmenu", (event) => {
    selectedElement = event.target;

    //Remove the hover highlight after selecting an element
    if (hoveredElement) {
        hoveredElement.classList.remove(
            "developer-toolkit-highlight"
        );
    }

    // console.log("Selected elemeeeeeeent:", selectedElement);
});


chrome.runtime.onMessage.addListener((message) => {
    console.log("Tool requested:", message.action);

    switch (message.action) {
        case "copy-html":
            if (!selectedElement) {
                showToast("No element selected");
                return;
            }

            copyHTML();
            break;
        case "copy-css":
            if (!selectedElement) {
                showToast("No element selected");
                return;
            }

            copyCSS();
            break;
        case "copy-selector":
            if (!selectedElement) {
                showToast("No element selected");
                return;
            }

            copySelector();
            break;
        case "copy-image-url":
            if (!selectedElement) {
                showToast("No element selected");
                return;
            }

            copyImageURL();
            break;
        case "extract-links":
            if (!selectedElement) {
                showToast("No element selected");
                return;
            }

            extractLinks();
            break;

        default:
            console.error("Unknown tool requested:", message.action);
    }
});

function copyHTML() {
    const html = selectedElement.outerHTML;
    copyToClipboard(html);
    console.log("HTML copied:", html);
    showToast("HTML copied");
}

function copyCSS() {
    const styles = getComputedStyle(selectedElement);
    const css = `
        width: ${styles.width};
        height: ${styles.height};
        background: ${styles.backgroundColor};
        font-size: ${styles.fontSize};
        color: ${styles.color};
        margin: ${styles.margin};
        padding: ${styles.padding};
        border: ${styles.border};
        border-radius: ${styles.borderRadius};
        box-shadow: ${styles.boxShadow};
        text-align: ${styles.textAlign};
        font-family: ${styles.fontFamily};
        font-weight: ${styles.fontWeight};
        text-decoration: ${styles.textDecoration};
        font-style: ${styles.fontStyle};
        text-transform: ${styles.textTransform};
        letter-spacing: ${styles.letterSpacing};
        line-height: ${styles.lineHeight};
        word-spacing: ${styles.wordSpacing};
        text-shadow: ${styles.textShadow};
        box-sizing: ${styles.boxSizing};
        display: ${styles.display};
        position: ${styles.position};
        top: ${styles.top};
        right: ${styles.right};
        bottom: ${styles.bottom};
        left: ${styles.left};
        z-index: ${styles.zIndex};
        overflow: ${styles.overflow};
        cursor: ${styles.cursor};
        opacity: ${styles.opacity};
        visibility: ${styles.visibility};
        transition: ${styles.transition};
        transform: ${styles.transform};
    `;
    copyToClipboard(css);
    console.log("CSS copied:", css);
    showToast("CSS copied");
}

function copySelector() {
    const selector = generateSelector(selectedElement);
    copyToClipboard(selector);
    console.log("Selector copied:", selector);
    showToast("Selector copied");

}

function copyImageURL() {
    let image = selectedElement;

    // if the selected element isn't an image, look for an image inside it.
    if (image.tagName !== "IMG") {
        image = selectedElement.querySelector("img");
    }

    if (!image) {
        showToast("No image found");
        return;
    }

    const imageURL = image.src;
    copyToClipboard(imageURL);
    showToast("Image URL copied");
    console.log("Image URL copied:", imageURL);
}

function extractLinks() {
    const links = Array.from(document.querySelectorAll("a"))
        .map((link) => link.href)
        .filter((href) => href && href.startsWith("http"));

    if (links.length === 0) {
        showToast("No links found");
        return;
    }

    const uniqueLinks = [...new Set(links)];
    const linkText = uniqueLinks.join("\n");
    copyToClipboard(linkText);
    showToast(`${uniqueLinks.length} links copied to clipboard`);
    console.log("Links copied:", uniqueLinks);
}

function generateSelector(element) {
    const path = [];

    while (element && element.nodeType === 1) {
        let selector = element.tagName.toLowerCase();

        // Use ID if available
        if (element.id) {
            selector += `#${CSS.escape(element.id)}`;
            path.unshift(selector);

            const fullSelector = path.join(" > ");
            if (document.querySelectorAll(fullSelector).length === 1) {
                return fullSelector;
            }
        }

        // Add classes if available
        if (element.classList.length > 0) {
            const classes = Array.from(element.classList)
                .filter((className) => !className.includes(":"))
                .map((className) => CSS.escape(className));

            if (classes.length > 0) {
                selector += "." + classes.join(".");
            }
        }

        // Add nth-child when needed
        const parent = element.parentElement;

        if (parent) {
            const siblings = Array.from(parent.children);
            const index = siblings.indexOf(element) + 1;

            selector += `:nth-child(${index})`;
        }

        path.unshift(selector);
        const fullSelector = path.join(" > ");

        if (document.querySelectorAll(fullSelector).length === 1) {
            return fullSelector;
        }

        element = parent;
    }
    return path.join(" > ");
}

function copyToClipboard(text) {
    const textarea = document.createElement("textarea");

    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    const successful = document.execCommand("copy");
    textarea.remove();

    if(successful) {
        // console.error("Failed to copy to clipboard");
        showToast("CSS copied");
    }
}

function highlightElement(element) {
    if (!element || element === document.body || element === document.documentElement) {
        return;
    }

    if (hoveredElement && hoveredElement !== element) {
        hoveredElement.classList.remove("developer-toolkit-highlight");
    }
    element.classList.add("developer-toolkit-highlight");
}

function addHighlightStyle() {

    // Dont create the style twice if it already exists
    if (document.getElementById("developer-toolkit-styles")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "developer-toolkit-styles";
    style.textContent = `
        .developer-toolkit-highlight {
            outline: 2px solid #3b82f6 !important;
            outline-offset: 2px !important;
        }
    `;

    document.head.appendChild(style);
}

function showToast(message) {
  const existingToast = document.getElementById(
    "developer-toolkit-toast"
  );

  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");

  toast.id = "developer-toolkit-toast";

  toast.textContent = message;

  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.zIndex = "2147483647";
  toast.style.padding = "10px 16px";
  toast.style.background = "#111";
  toast.style.color = "#fff";
  toast.style.borderRadius = "6px";
  toast.style.fontFamily = "Arial, sans-serif";
  toast.style.fontSize = "14px";
  toast.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.25)";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}
