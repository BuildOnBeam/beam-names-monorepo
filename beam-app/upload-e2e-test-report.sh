#!/bin/bash

# This script is used to upload the Playwright HTML report ot a S3 static website bucket. Only used in CI.
# 
# The script needs to be called with two arguments:
# 1. The name of the S3 bucket to upload the HTML report to
# 2. The name of the HTML report to be uploaded
#
# Example usage:
#   ./upload-e2e-test-report.sh beam-e2e-test-reports 2024-12-19-10-49-00

# in AWS account Beam (975050050948)
bucket_name=$1
html_report_dir="e2e-tests/playwright-html-report"
report_name=$2

# print the current content of the tests directory
ls -lha e2e-tests

# print the current content of the HTML report directory
if ls -lha $html_report_dir; then
  echo "The HTML report is found! Continuing with the upload to S3..."
else
  echo "Error: No HTML report found! Exiting..."
  exit 1
fi

# upload the HTML report to the S3 bucket
if aws s3 cp --recursive $html_report_dir s3://$bucket_name/$report_name; then
  echo "The HTML report has been successfully uploaded to the S3 bucket: $bucket_name!"
else
  echo "Error: Failed to upload the HTML report to the S3 bucket: $bucket_name!"
  exit 1
fi