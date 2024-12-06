# 🐞 BugSensei Chrome Extension

![BugSensei Logo](icon.png)

## 📋 Description

BugSensei is a Chrome extension designed to streamline the process of capturing and reporting defects. It allows users to take screenshots of their current browser tab, upload them to a defect tracking system, and submit detailed defect reports. This extension is particularly useful for QA engineers and developers who need to quickly document and report issues during web application testing.

## 🚀 How It Works

BugSensei provides a user-friendly interface for capturing screenshots and submitting defect reports. The extension consists of a popup interface where users can enter defect details, take screenshots, and upload them. The settings page allows users to configure their API token and project codes.

### ✨ Key Features

- 📸 **Take Screenshot**: Capture the visible area of the current browser tab.
- 📤 **Upload Screenshot**: Upload the captured screenshot to a defect tracking system.
- 📝 **Submit Defect**: Submit a detailed defect report, including the screenshot and other relevant information.
- ⚙️ **Settings**: Configure API token and project codes for the defect tracking system.

## 🛠️ Technical Details

### 📂 File Structure

```plaintext
BugSensei/
├── manifest.json       # Configuration file for the Chrome extension
├── popup.html          # HTML file for the popup interface
├── popup.css           # CSS file for styling the popup interface
├── popup.js            # JavaScript file for handling the functionality of the popup interface
├── settings.html       # HTML file for the settings page
├── settings.css        # CSS file for styling the settings page
├── settings.js         # JavaScript file for handling the functionality of the settings page
├── background.js       # JavaScript file for handling background tasks, such as capturing screenshots
└── content.js          # JavaScript file for sending messages to the background script
```

### 🛡️ Permissions

The extension requires the following permissions:

- `storage`: To store and retrieve API token and project codes.
- `activeTab`: To capture the visible area of the current tab.
- `host_permissions`: To access all URLs for capturing screenshots.

## 🏗️ Setup and Run

### 📋 Prerequisites

- Google Chrome browser

### 📥 Installation

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/yourusername/bugsensei.git
   ```
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click on the "Load unpacked" button and select the directory where you cloned the repository.
5. The BugSensei extension should now appear in your list of extensions.

### ⚙️ Configuration

1. Click on the BugSensei extension icon in the Chrome toolbar to open the popup interface.
2. Click on the "Settings" link to navigate to the settings page.
3. Enter your API token and project codes, then click "Save Settings".

### 🖱️ Usage

1. Click on the BugSensei extension icon to open the popup interface.
2. Select a project from the dropdown menu.
3. Enter the title, severity, and steps to reproduce the defect.
4. Click the "Take Screenshot" button to capture the visible area of the current tab.
5. After the screenshot is uploaded, click the "Submit Defect" button to submit the defect report.

### 🧪 Testing

#### 📝 Manual Testing

1. Open the BugSensei extension and navigate to the settings page.
2. Enter a valid API token and project codes, then save the settings.
3. Open the popup interface and fill in the defect details.
4. Take a screenshot and verify that it is uploaded successfully.
5. Submit the defect report and verify that it is logged in the defect tracking system.

#### 🤖 Automated Testing

Currently, BugSensei does not include automated tests. However, you can add unit tests for the JavaScript functions using a testing framework like Jest or Mocha.

## 🤝 Contributing

If you would like to contribute to BugSensei, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with descriptive messages.
4. Push your changes to your forked repository.
5. Create a pull request to the main repository.

## 🔮 Future Plans

### 📝 Detailed Steps:

1. **User Interaction**: The user interacts with the Chrome extension to take a screenshot, enable auto capture, or manually enter defect details.
2. **Auto Capture**: The extension uses the Chrome Dev Protocol to record user steps on the webpage. It captures console logs and network logs to populate the "Actual Results" field.
3. **Populate UI**: The extension UI is populated with the auto-captured data, allowing the user to review and edit the details.
4. **Send Data to Backend**: The extension sends the captured and manually entered data to the backend Node.js server.
5. **Process Request**: The backend server receives the data and uses Huggingface models to analyze and rewrite the "Title", "Actual Result", and "Steps to Reproduce". It also reevaluates the severity based on the details and screenshots.
6. **Analyze and Rewrite Details**: The Huggingface models process the data to provide more contextually accurate and detailed information.
7. **Send Processed Data Back**: The backend server sends the processed data back to the Chrome extension.
8. **Final Review**: The user reviews the processed data in the extension UI, makes any final edits if necessary, and submits the bug report.

### 🧩 Components:

- **Chrome Extension**:
  - `popup.html`: The main UI for entering defect details, taking screenshots, and enabling auto capture.
  - `popup.css`: Styles for the popup UI.
  - `popup.js`: Handles user interactions, auto capture, and communication with the backend server.
  - `settings.html`: UI for configuring API token and project codes.
  - `settings.css`: Styles for the settings UI.
  - `settings.js`: Handles settings interactions and navigation.
  - `background.js`: Handles background tasks such as capturing screenshots.
  - `content.js`: Sends messages to the background script.
- **Backend Server (Node.js)**:
  - `server.js`: Receives data from the Chrome extension, processes it using Huggingface models, and sends the processed data back to the extension.
- **Huggingface Models**:
  - Used by the backend server to analyze and rewrite defect details, and reevaluate severity.

### 🔄 Data Flow:

1. The user interacts with the Chrome extension to capture defect details.
2. If auto capture is enabled, the extension uses the Chrome Dev Protocol to record user steps and capture logs.
3. The extension populates the UI with the captured data, allowing the user to review and edit.
4. The user submits the defect details, which are sent to the backend server.
5. The backend server processes the data using Huggingface models to enhance the defect details.
6. The processed data is sent back to the Chrome extension.
7. The user reviews the processed data and makes any final edits before submitting the bug report.

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)
