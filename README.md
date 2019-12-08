
⚠️ **Please use [the offical TypeScript playground](http://www.typescriptlang.org/play/index.html), now it has all the same features and even more. Use https://github.com/microsoft/TypeScript-Website/issues for issues and questions.**

<hr />


# [TypeScript playground](https://typescript-play.js.org)

A better TypeScript playground.

Website: https://typescript-play.js.org.

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

Playground relies on [UNPKG](https://unpkg.com) to fetch `monaco-editor` (contains `typescript` through [`monaco-typescript`](https://github.com/Microsoft/monaco-typescript) package).

In case if `monaco-editor` is not updated to the latest TypeScript, the latest version can be built with `npm run get-typescript latest` and served locally.
If you run into errors, the latest monaco version may be incompatible with the latest typescript version,
in which case you'll need to update monaco-typescript upstream, or apply a patch locally (see the `# Patches` section in [get-typescript.sh](scripts/get-typescript.sh).

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

## Other useful links

* https://typescript-api-playground.glitch.me/ – exlore TS transforms
* https://ts-ast-viewer.com/ – TS AST viewer
* https://ts-creator.js.org/ - turn TypeScript code into AST builder expressions
