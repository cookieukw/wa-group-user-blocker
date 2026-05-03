# WA Group User Blocker

A powerful and lightweight browser extension for **WhatsApp Web** that allows you to block and hide messages from specific users within group chats. It also provides extra privacy features like filtering stickers and "view once" messages.

## 🚀 Why use this?
WhatsApp natively doesn't allow you to "mute" or "block" a specific person inside a group without blocking them entirely. This extension solves that by hiding their messages, avatars, and grouped content directly from your browser's view.

## ✨ Features
- **Specific User Blocking:** Hide messages from any user by entering their **Nickname** or **Phone Number**.
- **Group Message Support:** Automatically hides entire message blocks, including avatars and grouped bubbles from blocked users.
- **Hide Stickers:** Toggle to automatically hide all stickers in your chats.
- **Hide View Once Media:** Automatically hides "view once" photos and videos for added privacy.
- **Smart Detection:** Uses dynamic "session memory" to ensure that even if a nickname isn't present in a grouped message, the extension still knows who sent it and keeps it hidden.
- **Sidebar Protection:** Only hides messages in the active chat, keeping your chat list (sidebar) functional.
- **Privacy Focused:** All your settings and blocked users are stored locally in your browser. No data is ever sent to any server.

## ⚠️ Known Limitations
Please note that this is a community project and depends on the specific structure of WhatsApp Web's DOM, which changes frequently. You might encounter:
- **Intermittent visibility:** Sometimes the extension might fail to catch a message immediately.
- **Profile Picture residues:** In some edge cases, a profile picture might still be visible for a split second or remain due to specific grouping structures.
- **Media Filtering:** While it filters stickers and view-once messages, some specific media types or newly updated WhatsApp formats might still bypass the filter occasionally.
- **Performance:** On very large chats with thousands of messages, you might notice slight delays as the extension scans for content.

## 🛠 Installation

1.  **Download** or **Clone** this repository.
2.  Open your browser (Chrome, Edge, Brave, etc.) and navigate to `chrome://extensions/`.
3.  Enable **"Developer mode"** in the top right corner.
4.  Click on **"Load unpacked"** and select the folder where you saved this project.
5.  Open WhatsApp Web and enjoy a cleaner experience!

## 📖 How to Use

1.  Click on the extension icon in your toolbar to open the popup.
2.  **To block a user:**
    -   Enter the **Name** exactly as it appears in the group or their **Phone Number** (e.g., `5511999999999`).
    -   Click **Block**.
3.  **To manage settings:**
    -   Use the toggles to enable/disable **Hide Stickers** or **Hide View Once**.
4.  The changes are applied instantly. If you are already in a chat, you might need to scroll or wait for a new message for the observer to refresh the view.

## 💻 Technologies Used
- **JavaScript (Vanilla):** For DOM manipulation and logic.
- **CSS3:** For the modern, dark-themed UI.
- **HTML5:** For the popup structure.
- **Chrome Storage API:** For persistent local settings.
- **MutationObserver API:** To detect and hide new messages in real-time without slowing down the browser.

## 📝 License
This project is open-source and free to use. Feel free to contribute or modify it!

---
*Disclaimer: This extension is not affiliated with, authorized, maintained, sponsored or endorsed by WhatsApp or any of its affiliates or subsidiaries. Use at your own risk.*
