# MUI Tabs

[![NPM](https://img.shields.io/npm/v/mui-tabs.svg)](https://www.npmjs.com/package/mui-tabs)
![](https://badgen.net/npm/license/mui-tabs)
![](https://badgen.net/packagephobia/install/mui-tabs)
![](https://badgen.net/bundlephobia/min/mui-tabs)
![](https://badgen.net/bundlephobia/minzip/mui-tabs)
![](https://badgen.net/npm/dw/mui-tabs)
![](https://badgen.net/npm/dm/mui-tabs)

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
- [x] [Ripple effect supported](https://bilaleren.github.io/mui-tabs#ripple-effect)
- [x] [React Native supported](./NATIVE_README.md)

## Installation

```bash
yarn add mui-tabs@^2
```

> See [here](https://github.com/bilaleren/mui-tabs/tree/v3) for v3 installation and documentation.

## Examples

#### Basic example

```tsx
import * as React from 'react'
import { Tab, Tabs } from 'mui-tabs'

import 'mui-tabs/styles/main.css'
// or import 'mui-tabs/styles/scss/main.scss'

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

You need to install the **react-transition-group** package.

```bash
yarn add react-transition-group
```

**Example**

```tsx
import * as React from 'react'
import { Tab, Tabs } from 'mui-tabs'
import RippleButton from 'mui-tabs/RippleButton'

import 'mui-tabs/styles/main.css'
import 'mui-tabs/styles/ripple.css'
// or import 'mui-tabs/styles/all.css'
// or import 'mui-tabs/styles/scss/all.scss'

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
