# MUI Tabs For React Native

MUI Tabs is now available with React Native. [See example](https://snack.expo.dev/@bilaleren/mui-tabs?platform=android).

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
import IonIcon from 'react-native-vector-icons/Ionicons'

const App = () => {
  const [value, setValue] = React.useState(0)

  return (
    <Tabs
      value={value}
      variant="scrollable"
      onChange={onChange}
    >
      <Tab
        icon={<IonIcon name="home-outline" size={24} />}
        label="Top (Default)"
      />
      <Tab
        icon={<IonIcon name="heart-outline" size={24} />}
        label="Bottom"
        iconPosition="bottom"
      />
      <Tab
        icon={<IonIcon name="person-outline" size={24} />}
        label="End"
        iconPosition="end"
      />
      <Tab
        icon={<IonIcon name="settings-outline" size={24} />}
        label="Start"
        iconPosition="start"
      />
    </Tabs>
  )
}
```

#### Ripple Button example (only android)

You need to install the **color** package.

```bash
yarn add color
```

**Example**

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

#### Custom indicator example

```tsx
import * as React from 'react'
import { Tab, Tabs } from 'mui-tabs/native'

const App = () => {
  const [value, setValue] = React.useState(0)

  return (
    <Tabs
      value={value}
      variant="scrollable"
      onChange={(value) => setValue(value)}
      style={{
        backgroundColor: '#f2f2f2',
        borderRadius: 99
      }}
      tabProps={{
        color: '#000000',
        selectedColor: '#000000'
      }}
      indicatorProps={{
        color: '#ffffff',
        size: '100%',
        style: {
          zIndex: -1,
          borderRadius: 99
        }
      }}
      scrollButtons={true}
      scrollViewContainerProps={{
        style: {
          paddingVertical: 5
        }
      }}
    >
      <Tab label="Tab 1" />
      <Tab label="Tab 2" />
      <Tab label="Tab 3" />
      <Tab label="Tab 4" />
      <Tab label="Tab 5" />
      <Tab label="Tab 6" />
      <Tab label="Tab 7" />
    </Tabs>
  )
}
```
