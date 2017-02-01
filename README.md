# gemini-browserstack
Plugin for starting up a BrowserStack tunnel when running tests with Gemini

[![Build Status](https://travis-ci.org/Saulis/gemini-browserstack.svg?branch=master)](https://travis-ci.org/Saulis/gemini-browserstack)

## Requirements
Works with [gemini](https://github.com/gemini-testing/gemini) [v1.0.0](https://github.com/gemini-testing/gemini/releases/tag/v1.0.0) or later.

## Installation
`npm install gemini-browserstack`

## Configuration
- __username__ (optional) sets the username for BrowserStack. Defaults to environmental variable BS_USERNAME
- __accessKey__ (optional) sets the accesskey for BrowserStack. Defaults to environmental variable BS_ACCESS_KEY
- __localIdentifier__ (optional) sets the local identifier for BrowserStack. Enables you to run multiple parallel tests.

Example configuration for your `.gemini.yml`

```yml
rootUrl: http://localhost:8080/sut/
gridUrl: http://this.address.is.ignored/so-anything-goes

system:
  plugins:
    browserstack:
      username: foo
      accessKey: bar

browsers:
  ie11:
    desiredCapabilities:
      os: "WINDOWS"
      os_version: "7"
      browserName: "internet explorer"
      version: "11"

  chrome43:
    desiredCapabilities:
      os: "WINDOWS"
      os_version: "10"
      browserName: "chrome"
      version: "43"
```
