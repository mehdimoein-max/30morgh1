// NOTE: This is a blueprint for a backend server.
// It requires a Node.js environment with Express installed to run.
// It cannot be executed in the current frontend-only environment.

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

// --- Server Setup ---
const app = express();
const port = 3001; // A typical port for a dev API server.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db.json');

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json({ limit: '10mb' })); // Parse JSON bodies, with increased limit for base64 images

// --- API Endpoints ---

// Authentication Endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // In a real app, you would check credentials against a database.
  if (username === 'admin' && password === 'password') {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Data GET Endpoint
app.get('/api/data', async (req, res) => {
  try {
    const fileContent = await fs.readFile(dbPath, 'utf-8');
    res.json(JSON.parse(fileContent));
  } catch (error) {
    console.error("Error reading from database file:", error);
    res.status(500).json({ success: false, message: "Could not retrieve data from server." });
  }
});

// Data POST Endpoint (for updates)
app.post('/api/data', async (req, res) => {
  const newData = req.body;
  if (!newData) {
    return res.status(400).json({ success: false, message: 'No data provided' });
  }
  
  try {
    // Write the new data to the JSON file, effectively updating our "database".
    await fs.writeFile(dbPath, JSON.stringify(newData, null, 2), 'utf-8');
    console.log('Data updated successfully in db.json.');
    res.json({ success: true, message: 'Data updated successfully' });
  } catch (error) {
    console.error("Error writing to database file:", error);
    res.status(500).json({ success: false, message: "Could not save data to server." });
  }
});


// --- Serve Static Frontend ---
// This part is crucial for production deployment. It tells the Node server
// to also serve the built React application files (HTML, CSS, JS).
const buildPath = path.join(__dirname, '..', '..', 'dist'); // Assuming the built files are in a 'dist' folder at the root

app.use(express.static(buildPath));

// For any other request, serve the React app's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});


// --- Start Server ---
app.listen(port, () => {
  console.log(`Simorgh Holding API server listening at http://localhost:${port}`);
  console.log(`Database file is located at: ${dbPath}`);
});
