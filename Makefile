REPORTER = spec
TESTS = test/**/*.js test/**/**/*.js

test:
  @NODE_ENV=test NODE_PATH=./app/controllers ./node_modules/.bin/mocha \
    --reporter $(REPORTER) \
    --ui tdd \
    $(TESTS)

api-docs:
	cat ./app/api/1/*.js | ./node_modules/.bin/dox > ./app/api/1/docs.json

test-docs:
	make -s test REPORTER=markdown \
    > docs.md

.PHONY: api-docs test-docs test
