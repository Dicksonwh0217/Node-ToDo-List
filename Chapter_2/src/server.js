import express from 'express';
import path, {dirname} from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url); // "import.meta.url" gives URL of the current file while fileURLToPath convert the URL to file path
//Example: file:///C:/Users/Dickson/project/src/server.js -> C:\Users\Dickson\project\src\server.js
// Get the directory name from the file path
const __dirname = dirname(__filename);

// Middleware
app.use(express.json());
// Serves the HTML file from the /public directory
// Tells express to serve all files from the public folder as static assets / file. Any requests for the CSS file will be resolved to the public directory.
// This tells Express: “When a request comes in for /style.css, look inside the public folder.”
app.use(express.static(path.join(__dirname, '../public')));


// Serving up the HTML file from the /public directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

// authRoutes
app.use('/auth', authRoutes);
// todoRoutes
app.use('/todos',authMiddleware , todoRoutes);

app.listen(PORT, ()=> {
    console.log(`Server has started on port: ${PORT}`);
})