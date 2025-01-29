# Variables
url='localhost:8197/api/state'
tests_passed=1

# Debug: Test Google curl
debug_response=$(curl --write-out "%{http_code}" --silent --output /dev/null "https://www.google.com")

# Debug:Print Google response
echo "Response from https://www.google.com: $debug_response"


# Test calling the /state REST API function with GET method at port 8197
response=$(curl --write-out "%{http_code}" --silent --output /dev/null "$url")

# Debugging: Print response
echo "Response: $response"

# Checking if the response code is 200
if [ "$response" == '200' ]; then
    echo "Test passed: Received 200 OK"
    tests_passed = 0
else
    echo "Test failed: Expected 200, but got $response"
fi

# Debugging: Print tests_passed
echo "Tests passed: $tests_passed"

exit $tests_passed