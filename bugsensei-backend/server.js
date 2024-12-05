const express = require('express');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');
const app = express();
require('dotenv').config();

// Set up CORS
const allowedOrigins = [
  'chrome-extension://dejenognchecampnpkmpnnddfhflolic',
  'http://localhost:8000',
];
const options = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(options));

// Set up multer for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Middleware to parse JSON request body
app.use(express.json());

// Qase API settings
const QASE_API_KEY = process.env.QASE_API_TOKEN;
const QASE_PROJECT_CODE = process.env.QASE_PROJECT_CODE;

// Endpoint to log a bug
app.post('/log-bug', upload.array('screenshots'), async (req, res) => {
  const { title, severity, actual_result, steps } = req.body;
  const screenshots = req.files;

  console.log('Received bug log:', { title, severity, actual_result, steps });
  console.log('Screenshots:', screenshots);

  try {
    // Prepare the data for the Qase API
    const defectData = {
      title,
      severity,
      actual_result: `${actual_result}\nSteps to Reproduce:\n${steps}`,
      attachments: [],
    };

    // Handle screenshots
    if (screenshots.length > 0) {
      screenshots.forEach((file) => {
        defectData.attachments.push({
          file_name: file.originalname,
          url: `url_to_the_uploaded_file/${file.filename}`, // Replace with actual URL
        });
      });
    }

    // Make the API request to Qase
    const response = await axios.post(
      `https://api.qase.io/v1/defect/${QASE_PROJECT_CODE}/`,
      defectData,
      {
        headers: {
          Token: QASE_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      console.log('Defect created in Qase:', response.data);
      return res
        .status(200)
        .json({ message: 'Bug logged successfully in Qase' });
    } else {
      console.error('Failed to create defect in Qase:', response.data);
      return res.status(500).json({ error: 'Failed to create defect in Qase' });
    }
  } catch (error) {
    console.error('Error logging bug:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
