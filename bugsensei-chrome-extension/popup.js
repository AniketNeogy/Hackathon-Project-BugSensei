document.getElementById('bugForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const severity = document.getElementById('severity').value;
  const actualResult = document.getElementById('actualResult').value;
  const steps = document.getElementById('steps').value;
  const screenshots = document.getElementById('screenshots').files;

  const formData = new FormData();
  formData.append('title', title);
  formData.append('severity', severity);
  formData.append('actual_result', actualResult);
  formData.append('steps', steps);

  for (let i = 0; i < screenshots.length; i++) {
    formData.append('screenshots', screenshots[i]);
  }

  // Show loading response
  const responseDiv = document.getElementById('response');
  responseDiv.textContent = 'Submitting bug...'; // Show loading message
  responseDiv.style.display = 'block';
  responseDiv.style.backgroundColor = '#f0f0f0'; // Light grey for loading

  try {
    const response = await fetch('http://localhost:8000/log-bug', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Bug logged successfully in Qase') {
          responseDiv.textContent = 'Bug logged successfully!';
          responseDiv.style.backgroundColor = '#d4edda'; // Success color
        } else {
          responseDiv.textContent = 'Failed to log bug. Please try again.';
          responseDiv.style.backgroundColor = '#f8d7da'; // Error color
        }
        setTimeout(() => (responseDiv.style.display = 'none'), 5000); // Hide response after 5 seconds
      });
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('response').innerHTML = `
      <p>Error: Failed to log the bug</p>
    `;
  }
});
