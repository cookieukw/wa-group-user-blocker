document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('usernameInput');
  const addButton = document.getElementById('addButton');
  const blockedList = document.getElementById('blockedList');
  const hideStickersCheckbox = document.getElementById('hideStickers');
  const hideViewOnceCheckbox = document.getElementById('hideViewOnce');

  // Load blocked users and settings on popup open
  chrome.storage.local.get(['blockedUsers', 'hideStickers', 'hideViewOnce'], (result) => {
    const users = result.blockedUsers || [];
    renderList(users);

    // Default settings to true if undefined
    hideStickersCheckbox.checked = result.hideStickers !== false;
    hideViewOnceCheckbox.checked = result.hideViewOnce !== false;
  });

  // Save settings when toggled
  hideStickersCheckbox.addEventListener('change', () => {
    chrome.storage.local.set({ hideStickers: hideStickersCheckbox.checked });
  });

  hideViewOnceCheckbox.addEventListener('change', () => {
    chrome.storage.local.set({ hideViewOnce: hideViewOnceCheckbox.checked });
  });

  // Add user via button click
  addButton.addEventListener('click', () => {
    const name = input.value.trim();
    if (name) {
      addBlockedUser(name);
      input.value = '';
    }
  });

  // Add user via Enter key
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const name = input.value.trim();
      if (name) {
        addBlockedUser(name);
        input.value = '';
      }
    }
  });

  /**
   * Cleans up input: returns raw text for names, but extracts digits for numbers
   */
  function normalizeInput(input) {
    if (/[a-zA-Z]/.test(input)) {
      return input;
    }
    const digitsOnly = input.replace(/\D/g, '');
    if (digitsOnly.length >= 8) {
      return digitsOnly;
    }
    return input;
  }

  function addBlockedUser(rawName) {
    const name = normalizeInput(rawName);

    chrome.storage.local.get(['blockedUsers'], (result) => {
      let users = result.blockedUsers || [];
      if (!users.includes(name)) {
        users.push(name);
        chrome.storage.local.set({ blockedUsers: users }, () => {
          renderList(users);
        });
      }
    });
  }

  function removeBlockedUser(name) {
    chrome.storage.local.get(['blockedUsers'], (result) => {
      let users = result.blockedUsers || [];
      users = users.filter(user => user !== name);
      chrome.storage.local.set({ blockedUsers: users }, () => {
        renderList(users);
      });
    });
  }

  function renderList(users) {
    blockedList.innerHTML = '';
    
    if (users.length === 0) {
      blockedList.innerHTML = '<li class="subtitle" style="text-align:center; margin-top:8px;">No blocked users.</li>';
      return;
    }

    users.forEach(user => {
      const li = document.createElement('li');
      li.className = 'blocked-item';
      
      const span = document.createElement('span');
      span.textContent = user;
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.textContent = 'Remove';
      removeBtn.onclick = () => removeBlockedUser(user);
      
      li.appendChild(span);
      li.appendChild(removeBtn);
      blockedList.appendChild(li);
    });
  }
});
