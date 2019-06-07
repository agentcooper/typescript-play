#!/usr/bin/env bash

VERSION="$1"
MONACO_VERSION="${2:-latest}"
rm -rf monaco-typescript

set -o nounset
set -o errexit

git clone https://github.com/Microsoft/monaco-typescript

pushd monaco-typescript

if [ ! -z "$VERSION" ]; then
	# https://github.com/Microsoft/monaco-typescript#updating-typescript
  npm install typescript@$VERSION --save-dev
	# Continued below after applying patches
fi

npm install
INSTALLED_VERSION=`node -p "require('typescript').version"`

if [ ! -z "$VERSION" ]; then
	# Patches
  if [ $INSTALLED_VERSION = "2.9.1" ]; then
    git apply ../patch/2.9.1.patch
  fi
  if [ $INSTALLED_VERSION = "3.2.1" ]; then
    git apply ../patch/3.2.1.patch
  fi
  if [ $INSTALLED_VERSION = "3.5.1" ]; then
    git apply ../patch/3.5.1.patch
  fi

  npm run import-typescript
  npm run prepublishOnly
fi

popd

mkdir -vp ./public/monaco-typescript/${INSTALLED_VERSION}
cp -vr ./monaco-typescript/release/min/ ./public/monaco-typescript/${INSTALLED_VERSION}

echo "window.localTSVersion = { '$INSTALLED_VERSION': { monaco: '$MONACO_VERSION', lib: '/monaco-typescript/$INSTALLED_VERSION' } }" > public/env.js

echo
echo "Added typescript version '$INSTALLED_VERSION' with monaco version '$MONACO_VERSION'. Make sure they are compatible!"
echo "(You can customize them via arguments to this script.)"
