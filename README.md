# Material UI Tabs

[![License MIT](https://img.shields.io/badge/licence-MIT-blue.svg)](https://github.com/bilaleren/mui-tabs/blob/master/LICENCE)
[![NPM](https://img.shields.io/npm/v/mui-tabs.svg)](https://www.npmjs.com/package/mui-tabs)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![npm downloads](https://img.shields.io/npm/dt/mui-tabs.svg)](#installation)

This package was developed based on the [Material UI Tabs](https://mui.com/components/tabs/#main-content) component. [See example](https://bilaleren.github.io/mui-tabs).

## Differences

- emotion, etc. it is not used
- There is no Material UI requirement

## Features

- [x] [Icon tabs](https://bilaleren.github.io/mui-tabs#icon-tabs)
- [x] [Vertical tabs](https://bilaleren.github.io/mui-tabs#vertical-tabs)
- [x] [Scrollable tabs](https://bilaleren.github.io/mui-tabs#scrollable-tabs)
- [x] [Full width tabs](https://bilaleren.github.io/mui-tabs#fullwidth-tabs)
- [x] [Centered tabs](https://bilaleren.github.io/mui-tabs#centered-tabs)
- [x] [Ripple effect supported](https://bilaleren.github.io/mui-tabs#ripple-effect) (optional)
- [x] [React Native supported](./NATIVE_README.md)

## Installation

- If you want to use it for the web, you need to install the **clsx** package.
- If you want to use a [RippleButton](#ripple-effect-example), you need to install the **react-transition-group** package.

```bash
yarn add mui-tabs clsx
```

if you want to use the RippleButton

```bash
yarn add mui-tabs clsx react-transition-group
```

## Examples

#### Basic example

```tsx
import * as React from 'react'
import { Tab, Tabs } from 'mui-tabs'

import 'mui-tabs/dist/main.css'
// or import 'mui-tabs/dist/scss/main.scss'

const App = () => {
  const [value, setValue] = React.useState(1)

  return (
    <Tabs value={value} onChange={(value) => setValue(value)}>
      <Tab value={1} label="Tab 1" />
      <Tab value={2} label="Tab 2" />
    </Tabs>
  )
}
```

#### Ripple effect example

```tsx
import * as React from 'react'
import { Tab, Tabs } from 'mui-tabs'
import RippleButton from 'mui-tabs/RippleButton'

import 'mui-tabs/dist/main.css'
import 'mui-tabs/dist/ripple.css'
// or import 'mui-tabs/dist/all.css'
// or import 'mui-tabs/dist/scss/all.scss'

const App = () => {
  const [value, setValue] = React.useState(1)

  return (
    <Tabs
      value={value}
      variant="scrollable"
      scrollButtons={true}
      onChange={(value) => setValue(value)}
      TabComponent={RippleButton}
      ScrollButtonComponent={RippleButton}
      allowScrollButtonsMobile={true}
    >
      <Tab value={1} label="Tab 1" />
      <Tab value={2} label="Tab 2" />
      <Tab value={3} label="Tab 3" />
      <Tab value={4} label="Tab 4" />
      <Tab value={5} label="Tab 5" />
      <Tab value={6} label="Tab 6" />
      <Tab value={7} label="Tab 7" />
    </Tabs>
  )
}
```

## License

This project is licensed under the terms of the
[MIT license](https://github.com/bilaleren/mui-tabs/blob/master/LICENCE).
