# Variables

tests_passed=1

# Test calling the /state REST API function with GET method at port 8197
# The curl parameter -w "%{response_code}" captures  the code from the HTTP response
# Parameter -s makes the terminal silent during curl call
# Parameter -X is used to specify the HTTP method
# The response code is stored in a variable
response=$(curl -s -w "%{response_code}" localhost:8197/api/state -X GET)

# Checking if the response code is 200
if [[ "$response" == *200 ]]; then
    echo "Test passed: Received 200 OK"
    tests_passed = 0
else
    echo "Test failed: Expected 200, but got $response"
fi

exit $tests_passed