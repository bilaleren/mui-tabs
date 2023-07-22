#!/usr/bin/env bash

DIST_PATH="$PWD/dist"
PACKAGE_NAME="$(node -p 'require("./package.json").name')"
PACKAGE_VERSION="$(node -p 'require("./package.json").version')"
TARBALL_PATH="$DIST_PATH/$PACKAGE_NAME-v$PACKAGE_VERSION.tgz"

yarn build
cd "$DIST_PATH" || exit
yarn pack
yarn publish "$TARBALL_PATH" --new-version "$PACKAGE_VERSION"
