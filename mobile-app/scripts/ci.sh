#!/bin/bash
set -e

isOSX() {
  [ "$(uname)" == "Darwin" ] && ([ $OS == "osx" ] || [ $OS == "both" ])
}
npm i

# Build iOS
if isOSX; then
  cd ./mobile-app/ && npm i
  cd ./ios/
  bundle install --gemfile=Gemfile --quiet
  bundle exec fastlane release
fi
