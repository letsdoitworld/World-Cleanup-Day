#!/bin/sh
export SENTRY_PROPERTIES=sentry.properties
../node_modules/sentry-cli-binary/bin/sentry-cli upload-dsym
