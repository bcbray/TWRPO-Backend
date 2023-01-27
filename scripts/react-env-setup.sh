#!/bin/sh

if echo ${HEROKU_APP_NAME} | grep "twrpo-pr"; then
  APP_HOST="${HEROKU_APP_NAME}.herokuapp.com"
  echo "Setting REACT_APP_APPLICATION_HOST to ${APP_HOST}"
  echo "REACT_APP_APPLICATION_HOST=\"${HEROKU_APP_NAME}\"" >> frontend/.env
  echo "Setting ROOT_URL to https://${APP_HOST}"
  echo "ROOT_URL=\"https://${APP_HOST}\"" >> frontend/.env
  DD_ENV="review-${HEROKU_APP_NAME}"
  echo "Setting DD_ENV to ${DD_ENV}"
  echo "DD_ENV=\"${DD_ENV}\"" >> frontend/.env
fi

if [ -n "$DD_ENV" ]; then
  echo "Setting REACT_APP_DD_ENV to ${DD_ENV}"
  echo "REACT_APP_DD_ENV=\"${DD_ENV}\"" >> frontend/.env
fi

if [ -n "$SOURCE_VERSION" ]; then
  DD_TAGS="git.commit.sha:${SOURCE_VERSION} git.repository_url:github.com/bcbray/TWRPO-Backend"
  echo "Setting DD_TAGS to ${DD_TAGS}"
  echo "DD_TAGS=\"${DD_TAGS}\"" >> frontend/.env
fi
