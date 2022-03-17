[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# devolve-ui-demos: demos for devolve-ui

See [devolve-ui](https://github.com/Jakobeha/devolve-ui)

**[Live demo](https://jakobeha.github.io/devolve-ui-demos/index.html) | [Latest build (TUI demo)](https://github.com/Jakobeha/devolve-ui-demos/releases/lastest)**

## Installing

devolve-ui-demos can be installed using [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/).

```shell
pnpm install @raycenity/devolve-ui-demos
```

Alternatively you can just download the built code directly [here](https://github.com/Jakobeha/devolve-ui-demos/releases/latest). The code is an unminified ES module (learn about ES modules [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules))

## Repository info (e.g. for contributing)

devolve-ui-demos is built using [esbuild](https://esbuild.org/). The package manager used is [pnpm](https://pnpm.io/). Linting is done by [standard](https://standardjs.com/), however we use a *slightly* modified version removing some warnings which is run through `pnpm run lint` (specifically `node ts-standardx.mjs`).
