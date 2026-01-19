# Clean New Tab

A minimal, customizable new tab extension for Microsoft Edge and Google Chrome that replaces the default new tab page with a clean, distraction-free interface.

<p align="center">
  <img src="screenshots/clean.png" alt="Clean New Tab" width="80%">
  <br>
  <em>Clean, minimal interface with quick links</em>
</p>

<p align="center">
  <img src="screenshots/menu.png" alt="Settings Menu" width="80%">
  <br>
  <em>Customizable backgrounds and quick links management</em>
</p>

## ✨ Features

- **🖼️ Custom Backgrounds** - Choose from preset backgrounds or upload your own (supports up to 8K resolution)
- **🔗 Quick Links** - Add, edit, and remove shortcuts to your favorite websites
- **🎨 Minimal Design** - Clean, modern interface with beautiful animations
- **💾 Persistent Storage** - All settings are saved locally
- **🔒 Privacy Focused** - No data collection, everything stays on your device

## 📦 Installation

### From Source (Developer Mode)

1. Clone this repository:
   ```bash
   git clone https://github.com/tungcorn/clean-new-tab.git
   ```

2. Open your browser's extension page:
   - **Edge**: `edge://extensions`
   - **Chrome**: `chrome://extensions`

3. Enable **Developer mode** (toggle in top right)

4. Click **Load unpacked** and select the cloned folder

5. Open a new tab to see the extension in action!

## 🎮 Usage

### Changing Background
1. Click the ⚙️ settings icon (bottom right)
2. Choose a preset background or:
   - Enter a custom URL and click **Apply URL**
   - Click **📁 Choose Image** to upload from your computer

### Managing Quick Links
1. Click the ⚙️ settings icon
2. Click **✏️ Edit** to enable edit mode
3. Click the × on any link to delete it
4. Click **➕ Add New** to add a new link
5. Click **✅ Done** when finished

### Reset to Default
Click **🔄 Reset to Default** to restore original settings

## 🗂️ Project Structure

```
clean-new-tab/
├── manifest.json     # Extension manifest
├── newtab.html       # New tab page HTML
├── app.js            # Main application logic
├── styles.css        # Styling
├── screenshots/      # README images
└── README.md         # This file
```

## 🛠️ Technical Details

- **Manifest Version**: 3
- **Storage**: Uses `chrome.storage.local` with `unlimitedStorage` permission for high-resolution images
- **Compatibility**: Microsoft Edge, Google Chrome, and other Chromium-based browsers

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📝 Changelog

### v1.0.0
- Initial release
- Custom background support (URL and local files)
- Quick links management
- Edit mode for easy link removal
- Responsive design

---

Made with ❤️ for a cleaner browsing experience
