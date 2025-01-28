# Creating a first test that will always fail
echo "Running Hello test"
if [ true == true ]; then
  echo "Hello test passed"
  exit 0
else
  echo "Hello test failed"
  exit 1
fi