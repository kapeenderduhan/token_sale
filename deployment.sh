#!/bin/bash

# Build the new Docker image
docker build -t ghapp .

# Check if the new image build was successful
if [ $? -eq 0 ]; then
  # Remove Dangling Images
  echo "Remove Previous Image."
  DANGLING_IMAGES=$(docker images -f "dangling=true" -q)

if [ -n "$DANGLING_IMAGES" ]; then
  echo "$DANGLING_IMAGES" | xargs docker rmi -f
else
  echo "No dangling images found."
fi
else
  echo "Image build failed. Keeping the previous image."
fi
