#!/bin/bash

container_name=blogapp
image_name=duck_blog

docker rm -f $container_name

docker rmi $image_name

deploy-dockerc
