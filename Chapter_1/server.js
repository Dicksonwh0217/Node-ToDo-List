// The address of this server connected to the network is: 
// URL -> http://localhost:3000
// IP -> 127.0.0.1:3000
const express = require('express');
const app = express();
const port = 3000;

let data = [{
    name: 'Dickson',
    email: 'dicksonwh0217@gmail.com'
}, {
    name: 'Jake',
    email: 'Jake214@gmail.com'
}]

// Middleware
app.use(express.json());

// ENDPOINT = HTTP VERBS (method) && Routes (or paths)
// The method informs the nature of request and the route is a further 
// subdirectory (basically we direct the request to the body of code to 
// respond appropriately and these locations or routes are called endpoints)


// Type 1 - Website endpoints (these endpoints are for sending back html and they typically come when a user enters a url in a browser )
app.get('/', (req, res) => {
    res.send(`
        <body style="background : pink; color : blue">
            <h1>Home Page</h1>
            <p>${JSON.stringify(data)}</p>
            <a href="/dashboard">Go to Dashboard</a>
        </body>    
    `);
})

app.get('/dashboard', (req, res) => {
    res.send(`
        <h1>Dashboard</h1>
        Hi, <b>${data.map((data) => {
            return(data.name);
        })}</b>`);
})

// Type 2 - API endpoints

// CRUD-method - create-post read-get update-put and delete-delete

app.get('/api/data', (req, res) => {
    console.log('request for data')
    if (data) {
        res.send(data);
    }
})

app.post('/api/data', (req,res) => {
    // someone wants to create a user (for example when they click a sign up button)
    // the user clicks the sign up button after entering their confidentials and their browser is wired up to send out a network request to the server to handle that action
    const newEntry = req.body;
    console.log(newEntry);
    data.push(newEntry);
    res.sendStatus(201);
})

app.delete('/api/endpoint', (req, res) => {
    data.pop();
    res.sendStatus(203);
})

app.listen(port, () => {
    console.log(`server started on port ${port}`);
})