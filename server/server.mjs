// NOTE: This is a blueprint for a backend server.
// It requires a Node.js environment with Express installed to run.
// It cannot be executed in the current frontend-only environment.

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Data Initialization ---
// In a real application, this data would come from a database (e.g., PostgreSQL, MongoDB).
// For this blueprint, we initialize it from a direct copy of the constant data.
import { holdingData as initialData } from '../constants/data.js';

// The server's in-memory "database".
let dbData = initialData;

// --- Server Setup ---
const app = express();
const port = 3001; // A typical port for a dev API server.

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse JSON request bodies

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
app.get('/api/data', (req, res) => {
  // This helper function prepares the data to be sent as JSON.
  // It replaces function components (icons) with string identifiers.
  const getIconName = (iconComponent) => {
      const iconMap = {
          'BuildingIcon': 'BuildingIcon', 'RocketIcon': 'RocketIcon', 'ShieldCheckIcon': 'ShieldCheckIcon',
          'UsersIcon': 'UsersIcon', 'LightBulbIcon': 'LightBulbIcon', 'HeartIcon': 'HeartIcon',
          'BarChartIcon': 'BarChartIcon', 'DiamondIcon': 'DiamondIcon', 'FeatherIcon': 'FeatherIcon',
          'EyeIcon': 'EyeIcon', 'TargetIcon': 'TargetIcon', 'StarIcon': 'StarIcon',
      };
      // This is a simplified lookup; a more robust solution would be needed if icon components were not uniquely named.
      for (const [key, value] of Object.entries(iconMap)) {
          // This comparison is tricky in JS. We'll use the function's name.
          if (iconComponent.name === key) {
              return value;
          }
      }
      return 'StarIcon'; // Fallback
  };

  const dataToSend = JSON.parse(JSON.stringify({
    ...dbData,
    values: {
        ...dbData.values,
        items: dbData.values.items.map(item => ({...item, icon: getIconName(item.icon) })),
    },
    subsidiaries: dbData.subsidiaries.map(company => ({
        ...company,
        services: company.services.map(service => ({ ...service, icon: getIconName(service.icon) })),
        competitiveAdvantages: company.competitiveAdvantages.map(advantage => ({ ...advantage, icon: getIconName(advantage.icon) })),
        assets: company.assets.map(asset => ({ ...asset, icon: getIconName(asset.icon) })),
    }))
  }));

  res.json(dataToSend);
});


// Data POST Endpoint (for updates)
app.post('/api/data', (req, res) => {
  const newData = req.body;
  if (!newData) {
    return res.status(400).json({ success: false, message: 'No data provided' });
  }
  
  // In a real DB, you would perform an UPDATE operation here.
  // Here, we just replace the in-memory object.
  // The server does not need to hydrate icons, it just stores the string names.
  dbData = newData;

  console.log('Data updated successfully.');
  res.json({ success: true, message: 'Data updated successfully' });
});


// --- Serve Static Frontend ---
// This part is crucial for production deployment. It tells the Node server
// to also serve the built React application files (HTML, CSS, JS).
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.join(__dirname, '..', '..', 'dist'); // Assuming the built files are in a 'dist' folder at the root

app.use(express.static(buildPath));

// For any other request, serve the React app's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});


// --- Start Server ---
app.listen(port, () => {
  console.log(`Simorgh Holding API server listening at http://localhost:${port}`);
});
