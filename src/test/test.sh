#!/bin/bash

filtered_test=$(grep -rnwl ./src/test -e "test.only\|it.only\|describe.only" --include \*.js | tr '\n' ' ')

if [ "$verbose_test" == 'true' ]
then
  jest --coverage --runInBand --detectOpenHandles $filtered_test && jest-badge-generator
else
  jest --coverage --silent --runInBand --detectOpenHandles $filtered_test && jest-badge-generator
fi