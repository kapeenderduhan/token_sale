#!/bin/bash

# Build the new Docker image
docker build -t my-new-image .

# Check if the new image build was successful
if [ $? -eq 0 ]; then
  # Remove Dangling Images
  echo "Remove Previous Image."
  docker rmi -f $(docker images -f "dangling=true" -q)

else
  echo "Image build failed. Keeping the previous image."
fi
