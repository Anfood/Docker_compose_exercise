# Variables
url='http://localhost:8197/api/state'
tests_passed=1

# Test calling the /state REST API function with GET method at port 8197
response=$(curl --write-out "%{http_code}" --silent --output /dev/null "$url")

# Checking if the response code is 200
if [ "$response" == '200' ]; then
    echo "Test passed: Received 200 OK"
    tests_passed = 0
else
    echo "Test failed: Expected 200, but got $response"
fi

exit $tests_passed