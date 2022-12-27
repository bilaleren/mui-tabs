#!/usr/bin/env bash

if [ -f .env ]; then
  export "$(grep -v '^#' .env | xargs)"
fi

if [ -z "$GH_TOKEN" ]; then
  echo "The GH_TOKEN environment variable could not be provided. Check the .env file."
  exit 1
fi

BRANCH="example"
DIST="$PWD/packages/web/example/build"
REPO_PATH="$(node -p 'require("./package.json").repository.split("/").slice(-2).join("/")')"
REPO="https://$GH_TOKEN@github.com/$REPO_PATH"

gh-pages --dist "$DIST" --repo "$REPO" --branch "$BRANCH"
