#!/usr/bin/env bash

DIST_PATH="$PWD/dist"
PACKAGES_DIR="$PWD/packages"
PACKAGE_NAME="$(node -p 'require("./package.json").name')"

EXAMPLE_PATHS=("$PACKAGES_DIR/web/example" "$PACKAGES_DIR/native/Example")

for EXAMPLE_PATH in "${EXAMPLE_PATHS[@]}"; do
  rm -rf "$EXAMPLE_PATH/node_modules/$PACKAGE_NAME"
  cp -r "$DIST_PATH" "$EXAMPLE_PATH/node_modules/$PACKAGE_NAME"
done
