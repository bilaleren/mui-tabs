# MUI Tabs For React Native

MUI Tabs is now available with React Native.

> See [here](./KNOWN_ISSUES.md) for solutions to known issues.

## TabView

> See [here](./NATIVE_TABVIEW_README.md) for TabView documentation.

## Previews

|                                   Android                                   |                                 iOS                                 |
|:---------------------------------------------------------------------------:|:-------------------------------------------------------------------:|
| <img src="images/android-preview.gif" alt="MUI Tabs Android" width="325" /> | <img src="images/ios-preview.gif" alt="MUI Tabs iOS" width="325" /> |

## Examples

#### Basic example

```tsx
import * as React from 'react'
import { Tabs } from 'mui-tabs/native'

const App = () => {
  const [value, setValue] = React.useState(1)

  return (
    <Tabs
      tabs={[
        { value: 1, label: 'Tab 1' },
        { value: 2, label: 'Tab 2' },
        { value: 3, label: 'Tab 3' }
      ]}
      value={value}
      onChange={setValue}
    />
  )
}
```

#### Icon tabs example

```tsx
import * as React from 'react'
import { Tabs } from 'mui-tabs/native'
import IonIcon from 'react-native-vector-icons/Ionicons'

const App = () => {
  const [value, setValue] = React.useState(1)

  return (
    <Tabs
      tabs={[
        { value: 1 },
        { value: 2 },
        { value: 3 }
      ]}
      value={value}
      onChange={setValue}
      renderTabIcon={({ item, color, selected }) => {
        return {
          1: (
            <IonIcon
              size={24}
              name={selected ? 'home' : 'home-outline'}
              color={color}
            />
          ),
          2: (
            <IonIcon
              name={selected ? 'heart' : 'heart-outline'}
              size={24}
              color={color}
            />
          ),
          3: (
            <IonIcon
              name={selected ? 'person' : 'person-outline'}
              size={24}
              color={color}
            />
          )
        }[item.value];
      }}
    />
  )
}
```

#### Ripple Button example (only android)

You can give a special wave effect color using the `pressColor` prop.

```tsx
import * as React from 'react'
import { Tabs } from 'mui-tabs/native'
import RippleButton from 'mui-tabs/native/RippleButton'

const App = () => {
  const [value, setValue] = React.useState(1)

  return (
    <Tabs
      tabs={[
        { value: 1, label: 'Tab 1' },
        { value: 2, label: 'Tab 2' },
        { value: 3, label: 'Tab 3' }
      ]}
      value={value}
      onChange={setValue}
      tabComponent={RippleButton}
    />
  )
}
```

#### Badge Example

```tsx
import * as React from 'react'
import { Tabs } from 'mui-tabs/native'

const App = () => {
  const [value, setValue] = React.useState(1)

  return (
    <Tabs
      tabs={[
        { value: 1, label: 'Tab 1' },
        { value: 2, label: 'Tab 2' },
        { value: 3, label: 'Tab 3' }
      ]}
      value={value}
      onChange={setValue}
      renderTabBadge={({ item, color }) => {
        return {
          1: <Text style={{ color }}>1</Text>,
          2: <Text style={{ color }}>2</Text>,
          3: <Text style={{ color }}>3</Text>
        }[item.value];
      }}
    />
  )
}
```

#### Custom indicator example

```tsx
import * as React from 'react'
import { Tabs } from 'mui-tabs/native'

const App = () => {
  const [value, setValue] = React.useState(1)

  return (
    <Tabs
      tabs={[
        { value: 1, label: 'Tab 1' },
        { value: 2, label: 'Tab 2' },
        { value: 3, label: 'Tab 3' },
        { value: 4, label: 'Tab 4' },
        { value: 5, label: 'Tab 5' },
        { value: 6, label: 'Tab 6' },
        { value: 7, label: 'Tab 7' },
        { value: 8, label: 'Tab 8' },
        { value: 9, label: 'Tab 9' },
        { value: 10, label: 'Tab 10' }
      ]}
      value={value}
      onChange={setValue}
      scrollable={true}
      style={{
        borderRadius: 99,
        backgroundColor: '#f2f2f2'
      }}
      tabStyle={{
        width: 'auto'
      }}
      labelStyle={{
        color: '#000000'
      }}
      indicatorStyle={{
        height: '100%',
        zIndex: -1,
        borderRadius: 99,
        backgroundColor: '#ffffff'
      }}
      contentContainerStyle={{
        paddingHorizontal: 10
      }}
      indicatorContainerStyle={{
        zIndex: 0,
        marginVertical: 5
      }}
    />
  )
}
```
