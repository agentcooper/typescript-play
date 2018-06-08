# TypeScript playground

https://agentcooper.github.io/typescript-play/

Differences from https://www.typescriptlang.org/play:

* All strict options turned on by default
* More available compiler options
* Ability to switch TypeScript version
* More space for code
* More examples
* Quicker sharing, URL updates as you type
* Shorter sharing URLs

## Getting started

```
npm install
npm run setup
npm start
```

## Updating TypeScript

Playground relies on [UNPKG](https://unpkg.com) to fetch `monaco-editor` (contains `typescript` through `monaco-typescript` package).

In case if `monaco-editor` is not updated to the latest TypeScript, the latest version can be built with `npm run get-typescript latest` and served locally.

In case you want to serve some specific version of TypeScript locally you should run `npm run get-typescript <version>`. For example, to serve TypeScript version 2.8.3 you should run `npm run get-typescript 2.8.3; npm start`

## Browser compatibility

Tested with:

* Chrome 65
* Safari 11
* Firefox 58
* Microsoft Edge 41

## Prior art

* https://fabiandev.github.io/typescript-playground/
* http://hi104.github.io/typescript-playground-on-ace/
* http://drake7707.github.io/Typescript-Editor/
* http://niutech.github.io/typescript-interpret/
