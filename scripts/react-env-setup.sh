#!/bin/sh

if echo ${HEROKU_APP_NAME} | grep "twrpo-pr"; then
  echo "Setting REACT_APP_APPLICATION_HOST to ${HEROKU_APP_NAME}.herokuapp.com"
  echo "REACT_APP_APPLICATION_HOST=\"${HEROKU_APP_NAME}.herokuapp.com\"" >> frontend/.env
  echo "Setting ROOT_URL to https://${HEROKU_APP_NAME}.herokuapp.com"
  echo "ROOT_URL=\"https://${HEROKU_APP_NAME}.herokuapp.com\"" >> frontend/.env
fi
