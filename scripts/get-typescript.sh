#!/usr/bin/env bash

VERSION="$1"
rm -rf monaco-typescript

set -o nounset
set -o errexit

git clone https://github.com/Microsoft/monaco-typescript

pushd monaco-typescript

# https://github.com/Microsoft/monaco-typescript#updating-typescript
if [ ! -z "$VERSION" ]; then
  npm install typescript@$VERSION --save-dev

  if [ $VERSION = "2.9.1" ]; then
    git apply ../patch/2.9.1.patch
  fi

  npm run import-typescript
fi

npm install
INSTALLED_VERSION=`node -p "require('typescript').version"`

popd

mkdir -vp ./public/monaco-typescript/${INSTALLED_VERSION}
cp -vr ./monaco-typescript/release/min/ ./public/monaco-typescript/${INSTALLED_VERSION}

echo "window.localTSVersion = { '$INSTALLED_VERSION': { monaco: '0.13.1', lib: '/monaco-typescript/$INSTALLED_VERSION' } }" > public/env.js
