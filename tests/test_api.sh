# Variables
url='docker:8197'
tests_passed=1

# Test calling the /state REST API function with GET method at port 8197
response=$(curl --write-out "%{http_code}" --silent --output /dev/null "$url/state")

# Checking if the response code is 200
if [ "$response" == '200' ]; then
    echo "✅ Test passed: Received 200 OK for /GET state"
    tests_passed=0
else
    echo "❌ Test failed: Expected 200, but got $response"
    tests_passed=1
fi

# Checking if the state is "INIT"

response=$(curl --silent "$url/state")
if ["$response" == 'INIT']; then
    echo "✅ Test passed: State is INIT"
    tests_passed=0
else
    echo "❌ Test failed: State is not INIT"
    echo "State: $response"
    tests_passed=1
fi

# Checking if the state is "RUNNING" after calling the PUT /state REST API function
# Make the PUT request
response=$(curl -X PUT "$url/state" -d "RUNNING" \
    -H "Content-Type: text/plain" \
    -H "Accept: text/plain" --write-out "%{http_code}" --silent --output /dev/null)
# Check if the state is "RUNNING"
if ["$response" == '200']; then
    echo "✅ Test passed: Received 200 OK for /PUT 'RUNNING' state"
    tests_passed=0
else
    echo "❌ Test failed: State is not RUNNING"
    echo "State: $response"
    tests_passed=1
fi

# Checking if the state is "PAUSED" after calling the PUT /state REST API function
# Make the PUT request
response=$(curl -X PUT "$url/state" -d "PAUSED" \
    -H "Content-Type: text/plain" \
    -H "Accept: text/plain" --write-out "%{http_code}" --silent --output /dev/null)
# Check if the state is "PAUSED"
if ["$response" == '200']; then
    echo "✅ Test passed: Received 200 OK for /PUT 'PAUSED' state"
    tests_passed=0
else
    echo "❌ Test failed: State is not PAUSED"
    echo "State: $response"
    tests_passed=1
fi

# Checking if the containers are shut down after calling the "SHUTDOWN" PUT /state REST API function
# Make the PUT request
response=$(curl -X PUT "$url/state" -d "SHUTDOWN" \
    -H "Content-Type: text/plain" \
    -H "Accept: text/plain" --write-out "%{http_code}" --silent --output /dev/null)
# Check if the containers are shut down
if ["$response" == '200']; then
    echo "✅ Test passed: Received 200 OK for /PUT 'SHUTDOWN' state"
    tests_passed=0
else
    echo "❌ Test failed: Containers are not shut down"
    echo "State: $response"
    tests_passed=1
fi

# Checking if the docker containers are shut down
# Call the docker ps command with flag -q to get only the container IDs
response=$(docker ps -q)
if ["$response" == '']; then
    echo "✅ Test passed: Docker containers are shut down"
    tests_passed=0
else
    echo "❌ Test failed: Docker containers are not shut down"
    echo "State: $response"
    tests_passed=1
fi

exit $tests_passed