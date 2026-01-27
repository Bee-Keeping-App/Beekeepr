# Testing Methodology for BeekeepR
### Jacob Hebbel

## Information Architecture
I'm making a folder for every 'resource' + /data, which holds jsons for various data models.

### Test Folders Structure
There is a test file for every HTTP method that 'resource' supports (ex. GET, POST, PATCH, DELETE, etc).
Inside each test file are multiple tests for that resource/method combo. That's because each combo implements its own validation scheme, and that is the primary thing that needs to be tested in the early stages of development.

### /data Structure
/data doesn't hold tests. Instead, it holds jsons for every 'resource' we plan on testing. Most jsons will have the following keys at the surface level: `fields`, `isValid`, `errMsg`, `httpStatusCode`. 

`fields` var holds the data for creating that resource

The `isValid` flag indicates if the data in `fields` is sufficient for passing validation for that resource/method combo.

`errMsg` describes in detail (1 sentence max) why the data will cause an error. This field should be null if `isValid` is true. 

### setup.js
This file describes a series of operations to run before executing the test suite, namely spinning up a mongo instance in memory to run the queries on.

## Running the Test Suite
psh Idk rn

## Contributing to the Test Suite
### General Test Format
1. define what you need (likely an access + refresh token) in the beforeAll() function header
2. if running multiple operations on the same table, you may want to clear its contents every time. do this with the beforeEvery() function header.
3. idk