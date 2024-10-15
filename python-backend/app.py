import json
import os
import http.server

def get_free_disk_space():
    # Get free disk space using terminal command
    # https://stackoverflow.com/questions/19703621/get-free-disk-space-with-df-to-just-display-free-space-in-kb
    output = os.popen("df -h / | tail -1 | awk '{print $4}'").read()
    
    # Take the output of .run command and strip any extra characters
    free_space = output.strip()

    # Check if variable is not empty
    if free_space:
        return free_space
    else:
        return "No disk space found"

def get_container_ip():
    # Get the container IP addresses
    # Get IPv4 using terminal command
    output = os.popen("/sbin/ifconfig eth0 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}'").read()
    ipv4 = output.strip()

    # Get IPv6 address 
    output = os.popen("/sbin/ifconfig eth0 | grep 'inet6 addr:' | cut -d: -f2 | awk '{ print $1}'").read()
    ipv6 = output.strip()

    # Return both addresses if available, otherwise return an error message
    return_value = {}
    if ipv4:
        return_value["ipv4"] = ipv4
    if ipv6:
        return_value["ipv6"] = ipv6
    return return_value


def get_running_processes():
    # Get the running processes' information using terminal command
    output = os.popen("ps -e").read()

    # Split the output into lines
    lines = output.splitlines()

    # Split the first line to get headers
    headers = lines[0].split()

    # Create an empty list    
    processes = []
    # Loop through the remaining lines
    for line in lines[1:]:

        # Split each line into columns

        columns = line.split()

        # Create a dictionary to store process details
        process_details = {}
        # Loop through the headers and columns
        for i in range(len(headers)):
            headerValue = headers[i]
            columnValue = columns[i]

            # Add the header and column to the dictionary
            process_details[headerValue] = columnValue
        # Add the dictionary to the  list
        processes.append(process_details)
    return processes

def get_uptime():
    # Do a terminal command ps for the uptime
    output = os.popen("ps -p 1 -o etimes=").read()
    # Remove any extra characters
    uptime_seconds = output.strip()
    # Convert the uptime to an integer and return
    return int(uptime_seconds)

def get_container_details():
    # Gather all the container information
    ip_address = get_container_ip()
    processes = get_running_processes()
    availabe_disk_space = get_free_disk_space()
    uptime_seconds = get_uptime()

    return {
        "ip_address": ip_address,
        "processes": processes,
        "available disk space": availabe_disk_space,
        "uptime (seconds)": uptime_seconds
    }

# Simple HTTP server
class RequestHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            container_details = get_container_details()
            # Take the dictionary and convert it to a JSON string
            responseJSON = json.dumps(container_details)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            # Send the JSON object as a response
            self.wfile.write(responseJSON.encode())
        else:
            self.send_error(404, 'Not Found')

# HTTP server config
def run(server_class=http.server.HTTPServer, handler_class=RequestHandler, port=5000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting httpd server on port {port}')
    httpd.serve_forever()

# Start the server
if __name__ == "__main__":
    run()