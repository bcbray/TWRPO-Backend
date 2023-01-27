#!/bin/sh

if echo ${HEROKU_APP_NAME} | grep "twrpo-pr-"; then
  APP_HOST="${HEROKU_APP_NAME}.herokuapp.com"
  echo "Setting REACT_APP_APPLICATION_HOST to ${APP_HOST}"
  echo "REACT_APP_APPLICATION_HOST=\"${APP_HOST}\"" >> frontend/.env
  echo "Setting ROOT_URL to https://${APP_HOST}"
  echo "ROOT_URL=\"https://${APP_HOST}\"" >> frontend/.env
fi

. datadog/prerun.sh

if [ -n "$DD_ENV" ]; then
  echo "Setting REACT_APP_DD_ENV to ${DD_ENV}"
  echo "REACT_APP_DD_ENV=\"${DD_ENV}\"" >> frontend/.env
fi

if [ -n "$DD_VERSION" ]; then
  echo "Setting REACT_APP_DD_VERSION to ${DD_VERSION}"
  echo "REACT_APP_DD_VERSION=\"${DD_VERSION}\"" >> frontend/.env
fi
