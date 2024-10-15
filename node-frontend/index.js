// Import http for creating an HTTP server and execSync for executing shell commands
const http = require("http");
const { execSync } = require('child_process');

function getContainerIP() {
  const ip_address = {};

  // Get IPv4 by executing terminal command to get address of eth0
  const ipv4 = execSync("/sbin/ifconfig eth0 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}'")
    .toString().trim();
  // Check if IPV4 is found
  if (ipv4 ) {
    // Add the address to the ip_address object
    ip_address.ipv4 = ipv4;
  }

  // Get IPv6
  const ipv6 = execSync("/sbin/ifconfig eth0 | grep 'inet6 addr:' | cut -d: -f2 | awk '{ print $1}'")
    .toString().trim();
  // Check if IpV6 exists
  if (ipv6 ) {
    // Add the address to the ip_address object
    ip_address.ipv6 = ipv6;
  }

  if (!ipv4 && !ipv6) {
    return "No IP address found";
  } 

  return ip_address;
}

// Get list of container processes
function getProcesses() {
  // Execute terminal command to get the processes
  // With -e -o you can specify the columns you want to display
  // Skips the header row
  const output = execSync("ps -e -o user,pid,start,time,comm --no-heading").toString();
  // Split the output to lines
  const lines = output.trim().split("\n");

  // Create empty array for process objects
  const processes = [];

  // Loop through the lines
  lines.forEach((line) => {
    // Split the lines to parts, based on whitespace character
    const parts = line.trim().split(/\s+/);

    // Extract the fields from the array parts
    const user = parts[0];
    const pid = parts[1];
    const start = parts[2];
    const time = parts[3];
    const command = parts[4];

    // Create an object to store the process information
    const process = { user, pid, start, time, command };
    // Add the process object into the processes array
    processes.push(process);
  });

  // Return the list of process objects
  return processes;
}
// Get the uptime of the container in seconds
function getContainerUptime() {
  // Execute the command to get the uptime in seconds from the start time of the init process
  const output = execSync("ps -p 1 -o etimes=").toString().trim();
  const uptime_seconds = parseInt(output, 10);
  return uptime_seconds;
}
// Get free disk space of the container
function getFreeDiskSpace() {
  // Execute the command to get the free disk space
  return execSync("df -h / | tail -1 | awk '{print $4}'").toString().trim();
}

// This gathers all the system info and returns it as an object
function getSystemInfo() {
  const ip_address = getContainerIP();
  const processes = getProcesses();
  const free_disk_space = getFreeDiskSpace();
  const containerUptime = getContainerUptime();

  return {
    ip_address,
    processes,
    free_disk_space,
    uptime_seconds: containerUptime,
  };
}

// Fetch data from backend using fetch
async function fetchBackendData() {
  const response = await fetch("http://python-backend:5000/");

  return response.json();
}

// Create an HTTP server
const server = http.createServer(async (request, response) => {
    // Fetch data from the backend
    const backendJson = await fetchBackendData();

    // Get the frontend container info
    const service1info = getSystemInfo();

    // Combine the frontend and backend data
    const combinedJson = {
      service1: service1info,
      service2: backendJson,
    };

    // Send the combined JSON response
    response.end(JSON.stringify(combinedJson, null, 2));
});
// Server start
server.listen(8199, () => {

});
