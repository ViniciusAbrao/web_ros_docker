#! /bin/bash 

echo "$(date +'[%Y-%m-%d %T]') Starting nginx server..."
set -x
nginx -g 'daemon off;'
