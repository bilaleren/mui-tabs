# Material UI Tabs For React Native

Material UI is now available with React Native.

### Installation of requirements

The **color** package is required for the RippleButton. You don't need to install this package if you don't want to use [RippleButton](#ripple-button-example-only-android).

```shell
yarn add react-native-svg
```

if you want to use the RippleButton

```shell
yarn add color react-native-svg
```

### Examples

#### Basic example

```tsx
import * as React from 'react'
import { Tab, Tabs } from 'mui-tabs/native'

const App = () => {
  const [value, setValue] = React.useState(0)

  return (
    <Tabs value={value} onChange={(value) => setValue(value)}>
      <Tab label="Tab 1" />
      <Tab label="Tab 2" />
    </Tabs>
  )
}
```

#### Icon tabs example

```tsx
import * as React from 'react'
import { Tab, Tabs } from 'mui-tabs/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const App = () => {
  const [value, setValue] = React.useState(0)

  return (
    <Tabs
      value={value}
      centered={true}
      onChange={(value) => setValue(value)}
    >
      <Tab
        label="Top"
        icon={<MaterialCommunityIcons name="home" size={25} />}
        iconPosition="top"
      />
      <Tab
        label="Start"
        icon={<MaterialCommunityIcons name="heart" size={25} />}
        iconPosition="start"
      />
      <Tab
        label="End"
        icon={<MaterialCommunityIcons name="magnify" size={25} />}
        iconPosition="end"
      />
      <Tab
        label="Bottom"
        icon={<MaterialCommunityIcons name="phone" size={25} />}
        iconPosition="bottom"
      />
    </Tabs>
  )
}
```

#### Ripple Button example (only android)

```tsx
import * as React from 'react'
import { Tab, Tabs } from 'mui-tabs/native'
import RippleButton from 'mui-tabs/native/RippleButton'

const App = () => {
  const [value, setValue] = React.useState(0)

  return (
    <Tabs
      value={value}
      TabComponent={RippleButton}
      ScrollButtonComponent={RippleButton}
      onChange={(value) => setValue(value)}
    >
      <Tab label="Tab 1" />
      <Tab label="Tab 2" />
    </Tabs>
  )
}
```

#### Custom tab width example

```tsx
import * as React from 'react'
import { Tab, Tabs } from 'mui-tabs/native'

const App = () => {
  const [value, setValue] = React.useState(0)

  return (
    <Tabs
      value={value}
      variant="scrollable"
      tabProps={{
        width: 100 // Default tab width
      }}
      onChange={(value) => setValue(value)}
    >
      <Tab label="Tab 1" width={120} />
      <Tab label="Tab 2" width={150} />
      <Tab label="Tab 3" width={100} />
      <Tab label="Tab 4" width={90} />
      <Tab label="Tab 5" width={200} />
      <Tab label="Tab 6" width={160} />
    </Tabs>
  )
}
```

#### Custom indicator example

```tsx
import * as React from 'react'
import { Tab, Tabs } from 'mui-tabs/native'
import RippleButton from 'mui-tabs/native/RippleButton'

const App = () => {
  const [value, setValue] = React.useState(0)

  return (
    <Tabs
      value={value}
      insets={10}
      variant="scrollable"
      onChange={(value) => setValue(value)}
      scrollButtons={true}
      style={{
        backgroundColor: '#f2f2f2',
        borderRadius: 99,
        maxHeight: 58
      }}
      indicatorProps={{
        color: '#fff',
        size: '100%', // indicator height
        style: {
          borderRadius: 99,
          bottom: 5,
          zIndex: 1
        }
      }}
      tabProps={{
        color: '#000',
        selectedColor: '#000',
        style: {
          borderRadius: 99,
          zIndex: 2
        }
      }}
      scrollViewProps={{
        contentContainerStyle: {
          paddingHorizontal: 10,
          paddingVertical: 5
        }
      }}
      scrollButtonsProps={{
        iconColor: '#000',
        iconSize: 21
      }}
      ScrollButtonComponent={RippleButton}
    >
      <Tab label="1" />
      <Tab label="2" />
      <Tab label="3" />
      <Tab label="4" />
      <Tab label="5" />
      <Tab label="6" />
    </Tabs>
  )
}
```
