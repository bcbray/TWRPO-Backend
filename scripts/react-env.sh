#!/bin/sh

if echo ${HEROKU_APP_NAME} | grep "twrpo-pr"; then
  echo "Setting REACT_APP_APPLICATION_HOST to ${HEROKU_APP_NAME}.herokuapp.com"
  export REACT_APP_APPLICATION_HOST="${HEROKU_APP_NAME}.herokuapp.com"
fi
