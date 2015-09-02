# gemini-browserstack
Plugin for starting up a BrowserStack tunnel when running tests with Gemini

[![Build Status](https://travis-ci.org/Saulis/gemini-browserstack.svg?branch=master)](https://travis-ci.org/Saulis/gemini-browserstack)

## Requirements
Works with [gemini](https://github.com/gemini-testing/gemini) [v0.13.4](https://github.com/gemini-testing/gemini/releases/tag/v0.13.4) or later.

## Installation
`npm install gemini-browserstack`

## Configuration
- __username__ (optional) sets the username for BrowserStack. Defaults to environmental variable BS_USERNAME
- __accessKey__ (optional) sets the accesskey for BrowserStack. Defaults to environmental variable BS_ACCESS_KEY

Set the configuration to your `.gemini.yml`

```yml
system:
  plugins:
    browserstack:
      username: foo
      accessKey: bar
```
