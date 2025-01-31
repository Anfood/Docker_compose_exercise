const express= require('express');
const app = express();
const PORT = 8000;

// Save and fetch the state of the application
const fs = require('fs');
const path = require('path');
// Path to the file in the current directory
const stateFilePath = path.join(__dirname, 'state.txt');
const stateLogFilePath = path.join(__dirname, 'stateLog.txt');

const states = ["INIT", "PAUSED", "RUNNING", "SHUTDOWN"];
let state = "INIT";
let stateLog = [];

// Needed for processing the request body in text format
app.use(express.text());

function loadState() {
    // Check if the file exists
    if (fs.existsSync(stateFilePath)) {
        // Read the state from the file
        state = fs.readFileSync(stateFilePath, 'utf8');
    }
}

function saveState() {
    // Save the state to the file
    fs.writeFileSync(stateFilePath, state);
}

function saveState () {
    // Save the state to the file
    fs.writeFileSync(stateFilePath, state);
}

function logStateChange() {
    // Add the current state to the stateLog with timestamp
    const timestamp = new Date().toISOString();
    const logInput = `${timestamp} - ${state}`;
    // Add the log to the stateLog array
    stateLog.push(logInput);
    // Append the log to the state file
    fs.appendFileSync(stateLogFilePath, logInput + '\n');
}

app.put('/state', (req, res) => {
    const newState = req.body;
    // Check if the new state is a valid state
    if (states.includes(newState) && newState !== state) {
        // Set the state to the new state
        state = newState;
        // Log the state change
        logStateChange();
        // Save the state to the file
        saveState();
        res.status(200).send("State changed to " + newState);
    } else {
        res.status(400).send("Invalid state");
    }
});

// Fetch backend data from service1
app.get('/request', async (req, res) => {
    try {
        const response = await fetch('http://service1:8199/');
        const data = await response.text();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send(`Error fetching data from service1: ${error.message}`);
    }
});

// Load the state from the file
app.get('/state', (req, res) => {
    res.status(200).send(state);
});

// Load the state log from the file
app.get('/run-log', (req, res) => {
    res.status(200).send(stateLog.join('\n'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});