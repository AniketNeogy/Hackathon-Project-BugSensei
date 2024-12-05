// Save settings to chrome.storage.sync
document
  .getElementById('settingsForm')
  .addEventListener('submit', async (event) => {
    event.preventDefault();

    const apiToken = document.getElementById('apiToken').value;
    const projectCodes = document
      .getElementById('projectCodes')
      .value.split(',')
      .map((code) => code.trim());

    try {
      // Save API token and project codes
      await chrome.storage.sync.set({ apiToken, projectCodes });

      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    }
  });

// Fetch saved settings from chrome.storage.sync
async function loadSettings() {
  chrome.storage.sync.get(['apiToken', 'projectCodes'], (data) => {
    if (data.apiToken) {
      document.getElementById('apiToken').value = data.apiToken;
    }

    if (data.projectCodes) {
      document.getElementById('projectCodes').value =
        data.projectCodes.join(', ');
    }
  });
}

// Load settings when the page loads
loadSettings();

// Toggle token visibility
document.getElementById('toggleToken').addEventListener('click', () => {
  const apiTokenField = document.getElementById('apiToken');
  const type = apiTokenField.type === 'password' ? 'text' : 'password';
  apiTokenField.type = type;
});

// Handle Back Button (navigate back to the popup, instead of closing the window)
document.addEventListener('DOMContentLoaded', () => {
  const backButton = document.getElementById('backButton');
  if (backButton) {
    backButton.addEventListener('click', () => {
      // Close settings page and let the popup show when the user clicks the extension icon
      window.history.back(); // This will go back in history (should return to the popup)
    });
  } else {
    console.warn('backButton element not found!');
  }
});
