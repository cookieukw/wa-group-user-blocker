let blockedUsers = [];
let sessionBlockedNumbers = new Set(); // Stores phone numbers discovered via nickname matching
let hideStickers = true;
let hideViewOnce = true;

// Load initial configuration from storage
chrome.storage.local.get(['blockedUsers', 'hideStickers', 'hideViewOnce'], (result) => {
  blockedUsers = result.blockedUsers || [];
  hideStickers = result.hideStickers !== false;
  hideViewOnce = result.hideViewOnce !== false;
  console.log('WA Group User Blocker: Settings loaded');
  hideBlockedMessages();
});

// Listen for storage changes to update settings in real-time
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    if (changes.blockedUsers) {
      blockedUsers = changes.blockedUsers.newValue || [];
      sessionBlockedNumbers.clear(); // Clear session cache when blocklist changes
    }
    if (changes.hideStickers) hideStickers = changes.hideStickers.newValue;
    if (changes.hideViewOnce) hideViewOnce = changes.hideViewOnce.newValue;
    
    hideBlockedMessages();
  }
});

/**
 * Main function to scan and hide blocked messages
 */
function hideBlockedMessages() {
  const hasBlockedUsers = blockedUsers.length > 0;
  
  // Exit early if no filtering is active
  if (!hasBlockedUsers && !hideStickers && !hideViewOnce) {
    const hiddenRows = document.querySelectorAll('[data-blocked="true"]');
    hiddenRows.forEach(row => {
      row.style.display = '';
      row.removeAttribute('data-blocked');
    });
    return;
  }

  // Iterate over all [role="row"] elements (WhatsApp message rows)
  const rows = document.querySelectorAll('[role="row"]');

  rows.forEach(row => {
    // Skip sidebar and chat list rows
    if (row.closest('#pane-side') || row.closest('[data-testid="chat-list"]')) {
      return;
    }

    if (shouldHideMessage(row)) {
      // Hide the entire row to ensure avatar and grouped messages are removed
      row.setAttribute('data-blocked', 'true');
      row.style.display = 'none';
    } else {
      // Revert visibility if it was previously hidden but no longer matches
      if (row.getAttribute('data-blocked') === 'true') {
        row.removeAttribute('data-blocked');
        row.style.display = '';
      }
    }
  });
}

function shouldHideMessage(msgElement) {
  if (msgElement.querySelector('.message-out') || msgElement.closest('.message-out')) {
    return false;
  }

  if (hideStickers) {
    const isSticker = msgElement.querySelector('[data-testid="sticker-container"]') || 
                      msgElement.querySelector('.sticker-main');
    if (isSticker) return true;
  }

  if (hideViewOnce) {
    const isViewOnce = msgElement.querySelector('[data-testid="view-once-media-container"]') || 
                       msgElement.querySelector('[data-testid="view-once-media-viewed-container"]') ||
                       msgElement.querySelector('span[data-testid="view-once"]');
    if (isViewOnce) return true;
  }

  if (blockedUsers.length === 0 && sessionBlockedNumbers.size === 0) {
    return false;
  }

  let identifiers = [];
  const textInfo = msgElement.querySelector('[data-pre-plain-text]');
  if (textInfo) {
    identifiers.push(textInfo.getAttribute('data-pre-plain-text'));
  }

  let dataId = msgElement.getAttribute('data-id');
  if (!dataId) {
    const dataIdElement = msgElement.querySelector('[data-id]') || msgElement.closest('[data-id]');
    if (dataIdElement) {
      dataId = dataIdElement.getAttribute('data-id');
    }
  }

  if (dataId) {
    identifiers.push(dataId);
  }

  const nameSpans = msgElement.querySelectorAll('span[dir="auto"]');
  Array.from(nameSpans).slice(0, 3).forEach(span => {
    identifiers.push(span.textContent);
  });

  const megaString = identifiers.join(' || ').toLowerCase();
  const megaStringClean = megaString.replace(/\D/g, '');

  let isBlocked = false;

  for (const blockedUser of blockedUsers) {
    const blockedLower = blockedUser.toLowerCase();
    const cleanBlocked = blockedUser.replace(/\D/g, '');

    if (megaString.includes(blockedLower)) {
      isBlocked = true;
      break;
    }

    if (cleanBlocked.length >= 8 && megaStringClean.includes(cleanBlocked)) {
      isBlocked = true;
      break;
    }
  }

  let senderNumber = null;
  if (dataId) {
    const match = dataId.match(/(\d+)@c\.us/);
    if (match) {
      senderNumber = match[1];
    }
  }

  if (isBlocked && senderNumber) {
    sessionBlockedNumbers.add(senderNumber);
  } else if (!isBlocked && senderNumber && sessionBlockedNumbers.has(senderNumber)) {
    isBlocked = true;
  }

  return isBlocked;
}

/**
 * Optimized MutationObserver to detect new messages
 */
const observer = new MutationObserver((mutations) => {
  let shouldRun = false;
  for (const mutation of mutations) {
    if (mutation.addedNodes.length > 0) {
      shouldRun = true;
      break;
    }
  }
  
  if (shouldRun) {
    hideBlockedMessages();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

console.log('WA Group User Blocker: Group Mode Active (Sidebar Protection ON)');
