#!/bin/sh

if echo ${HEROKU_APP_NAME} | grep "twrpo-pr"; then
  DD_ENV="review-${HEROKU_APP_NAME}"
  echo "Setting DD_ENV to ${DD_ENV}"
fi

if [ -n "$SOURCE_VERSION" ]; then
  DD_TAGS="git.commit.sha:${SOURCE_VERSION} git.repository_url:github.com/bcbray/TWRPO-Backend"
  echo "Setting DD_TAGS to ${DD_TAGS}"
  DD_VERSION="${SOURCE_VERSION}"
  echo "Setting DD_VERSION to ${DD_VERSION}"
elif [ -n "$HEROKU_SLUG_COMMIT" ]; then
  DD_TAGS="git.commit.sha:${HEROKU_SLUG_COMMIT} git.repository_url:github.com/bcbray/TWRPO-Backend"
  echo "Setting DD_TAGS to ${DD_TAGS}"
  DD_VERSION="${HEROKU_SLUG_COMMIT}"
  echo "Setting DD_VERSION to ${DD_VERSION}"
fi
