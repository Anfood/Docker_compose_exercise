# Creating a first test that will always fail
echo "Running Hello test"
if [ false == true ]; then
  echo "Hello test passed"
else
  echo "Hello test failed"
  exit 1
fi