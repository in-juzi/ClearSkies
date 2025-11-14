#!/bin/bash

# Get the CloudFront distribution ID for clearskies.juzi.dev
DIST_ID=$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?Aliases.Items[?contains(@, 'clearskies.juzi.dev')]].Id" \
  --output text)

if [ -z "$DIST_ID" ]; then
  echo "Error: Could not find CloudFront distribution for clearskies.juzi.dev"
  exit 1
fi

echo "Found distribution ID: $DIST_ID"
echo "Creating invalidation for all paths (/*)"

# Create invalidation
aws cloudfront create-invalidation \
  --distribution-id "$DIST_ID" \
  --paths "/*"

echo "Invalidation created successfully!"
echo "It may take 1-5 minutes to complete."
