#!/bin/bash

# Build the new Docker image
docker build -t ghapp .

# Check if the new image build was successful
if [ $? -eq 0 ]; then
  # Remove Dangling Images
  echo "Remove Previous Image."
  docker images -f "dangling=true" -q | xargs docker rmi -f

else
  echo "Image build failed. Keeping the previous image."
fi
