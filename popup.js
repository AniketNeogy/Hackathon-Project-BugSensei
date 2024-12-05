const attachments = [];

document
  .getElementById('takeScreenshot')
  .addEventListener('click', async () => {
    const takeScreenshotButton = document.getElementById('takeScreenshot');
    const submitDefectButton = document.querySelector('button[type="submit"]');
    const loader = document.getElementById('loader');

    // Disable both buttons and apply disabled styling
    takeScreenshotButton.disabled = true;
    submitDefectButton.disabled = true;

    // Show the loader (spinner)
    loader.style.display = 'block';

    // Disable hover effects on buttons while disabled
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

          // Upload screenshot to Qase
          const uploadResponse = await fetch(
            'https://api.qase.io/v1/attachment/DEMO',
            {
              method: 'POST',
              headers: {
                Token:
                  '7fb455398a7e1f671f2d2a88bbe47df08e2886c3a28154276995321c50632dc6',
              },
              body: formData,
            }
          );

          const uploadResult = await uploadResponse.json();
          console.log('Upload response:', uploadResult); // Log the upload response

          if (uploadResult.result?.[0]?.hash) {
            // Push the hash to the attachments array
            attachments.push(uploadResult.result[0].hash);
          } else {
            console.error('Failed to upload attachment:', uploadResult);
          }

          // Wait for 3 seconds before hiding the loader
          await new Promise((resolve) => setTimeout(resolve, 3000));
        } catch (error) {
          console.error('Error uploading screenshot:', error);
        } finally {
          // Hide the loader after 3 seconds or when the upload is finished
          loader.style.display = 'none';

          // Re-enable both buttons and remove disabled styling
          takeScreenshotButton.disabled = false;
          submitDefectButton.disabled = false;
          takeScreenshotButton.classList.remove('disabled');
          submitDefectButton.classList.remove('disabled');
        }
      }
    );
  });

document
  .getElementById('defectForm')
  .addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const severity = document.getElementById('severity').value;
    const actualResult = document.getElementById('actualResult').value;
    const stepsToReproduce = document.getElementById('stepsToReproduce').value;

    console.log('attachments:', attachments); // Log the request body

    // Log defect to Qase API
    const defectResponse = await fetch('https://api.qase.io/v1/defect/DEMO', {
      method: 'POST',
      headers: {
        Token:
          '7fb455398a7e1f671f2d2a88bbe47df08e2886c3a28154276995321c50632dc6',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        severity,
        actual_result: actualResult,
        steps_to_reproduce: stepsToReproduce,
        attachments, // Attach any uploaded screenshot hashes
      }),
    });

    const defectResult = await defectResponse.json();
    console.log('Defect response:', defectResult); // Log the defect response
    if (defectResult.result?.id) {
      document.getElementById(
        'resultMessage'
      ).innerText = `Defect logged with ID: ${defectResult.result.id}`;
    } else {
      console.error('Failed to log defect:', defectResult);
    }
  });
