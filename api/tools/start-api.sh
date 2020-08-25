#!/bin/bash
# start api service

cd $(dirname $(dirname $0))
if [ -f ./venv/bin/activate ]; then
  source ./venv/bin/activate
fi
exec gunicorn -b 127.0.0.1:9001 -w 2 --threads 8 --access-logfile - main.wsgi
