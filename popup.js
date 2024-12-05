document.addEventListener('DOMContentLoaded', async () => {
  const attachments = [];

  // Fetch saved settings (API token and project codes)
  async function getSettings() {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(['apiToken', 'projectCodes'], (data) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(data);
        }
      });
    });
  }

  // Populate the project dropdown with project codes from settings
  async function populateProjectDropdown() {
    const { projectCodes } = await getSettings();
    const projectSelect = document.getElementById('projectSelect');

    // Clear the dropdown
    projectSelect.innerHTML = '';

    if (projectCodes && projectCodes.length > 0) {
      projectCodes.forEach((code) => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = code;
        projectSelect.appendChild(option);
      });
    } else {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = '-- No Projects Available --';
      projectSelect.appendChild(option);
    }
  }

  // Handle Take Screenshot and Upload
  document
    .getElementById('takeScreenshot')
    .addEventListener('click', async () => {
      const takeScreenshotButton = document.getElementById('takeScreenshot');
      const submitDefectButton = document.querySelector(
        'button[type="submit"]'
      );
      const loader = document.getElementById('loader');

      // Disable both buttons and show loader
      takeScreenshotButton.disabled = true;
      submitDefectButton.disabled = true;
      loader.style.display = 'block';
      takeScreenshotButton.classList.add('disabled');
      submitDefectButton.classList.add('disabled');

      chrome.runtime.sendMessage(
        { action: 'takeScreenshot' },
        async (response) => {
          const screenshot = response.screenshot;

          // Display screenshot in the UI
          const screenshotsDiv = document.getElementById('screenshots');
          const img = document.createElement('img');
          img.src = screenshot;
          img.alt = 'Screenshot';
          img.dataset.screenshot = screenshot; // Store the screenshot for submission
          screenshotsDiv.appendChild(img);

          try {
            // Convert the screenshot to a Blob
            const blob = await fetch(screenshot).then((res) => res.blob());
            const formData = new FormData();
            formData.append('file', blob, 'screenshot.png');

            // Fetch token and project code from settings
            const { apiToken, projectCodes } = await getSettings();

            if (!apiToken || projectCodes.length === 0) {
              throw new Error(
                'API Token or Project Codes not set in settings.'
              );
            }

            const projectCode = document.getElementById('projectSelect').value;
            if (!projectCode) {
              throw new Error('Please select a project to log the defect.');
            }

            // Upload screenshot to Qase
            const uploadResponse = await fetch(
              `https://api.qase.io/v1/attachment/${projectCode}`,
              {
                method: 'POST',
                headers: {
                  Token: apiToken,
                },
                body: formData,
              }
            );

            const uploadResult = await uploadResponse.json();
            console.log('Upload response:', uploadResult);

            if (uploadResult.result?.[0]?.hash) {
              // Push the hash to the attachments array
              attachments.push(uploadResult.result[0].hash);
            } else {
              console.error('Failed to upload attachment:', uploadResult);
            }

            await new Promise((resolve) => setTimeout(resolve, 3000));
          } catch (error) {
            console.error('Error uploading screenshot:', error);
            alert('Error: ' + error.message);
          } finally {
            // Re-enable buttons and hide loader
            loader.style.display = 'none';
            takeScreenshotButton.disabled = false;
            submitDefectButton.disabled = false;
            takeScreenshotButton.classList.remove('disabled');
            submitDefectButton.classList.remove('disabled');
          }
        }
      );
    });

  // Handle Submit Defect
  document
    .getElementById('defectForm')
    .addEventListener('submit', async (event) => {
      event.preventDefault();

      const title = document.getElementById('title').value;
      const severity = document.getElementById('severity').value;
      const actualResult = document.getElementById('actualResult').value;
      const stepsToReproduce =
        document.getElementById('stepsToReproduce').value;

      try {
        // Fetch token and project codes from settings
        const { apiToken, projectCodes } = await getSettings();

        if (!apiToken || projectCodes.length === 0) {
          throw new Error('API Token or Project Codes not set in settings.');
        }

        const projectCode = document.getElementById('projectSelect').value;
        if (!projectCode) {
          throw new Error('Please select a project to log the defect.');
        }

        // Log defect to Qase API
        const defectResponse = await fetch(
          `https://api.qase.io/v1/defect/${projectCode}`,
          {
            method: 'POST',
            headers: {
              Token: apiToken,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title,
              severity,
              actual_result: actualResult,
              steps_to_reproduce: stepsToReproduce,
              attachments, // Attach any uploaded screenshot hashes
            }),
          }
        );

        const defectResult = await defectResponse.json();
        console.log('Defect response:', defectResult);

        if (defectResult.result?.id) {
          document.getElementById(
            'resultMessage'
          ).innerText = `Defect logged with ID: ${defectResult.result.id}`;
        } else {
          console.error('Failed to log defect:', defectResult);
          alert('Failed to log defect. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting defect:', error);
        alert('Error: ' + error.message);
      }
    });

  // Call the populate function on load
  populateProjectDropdown();
});
