#!/bin/bash

cname=blogapp
iname=duck_blog
port=80
link_name=db
link_to=db

docker build -t $iname .

docker run --name $cname --rm -d --link $link_to:$link_name -p $port:3000 $iname




