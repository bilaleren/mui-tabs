export const basicTab = `
import * as React from 'react'
import { Tab, Tabs } from 'mui-tabs'

import 'mui-tabs/dist/main.css'

const App = () => {
  const [value, setValue] = React.useState(1)

  return (
    <Tabs value={value} onChange={(value) => setValue(value)}>
      <Tab value={1} label="Tab 1" />
      <Tab value={2} label="Tab 2" />
    </Tabs>
  )
}
`

export const coloredTab = `
import * as React from 'react'
import { Tab, Tabs } from 'mui-tabs'

import 'mui-tabs/dist/main.css'

const App = () => {
  const [value, setValue] = React.useState(1)

  return (
    <Tabs
      value={value}
      onChange={(value) => setValue(value)}
      TabProps={{ style: { color: 'purple' } }}
      TabIndicatorProps={{ style: { backgroundColor: 'purple' } }}
    >
      <Tab value={1} label="Tab 1" />
      <Tab value={2} label="Tab 2" />
    </Tabs>
  )
}
`

export const coloredTabWithTabStyle = `
import * as React from 'react'
import { Tab, Tabs } from 'mui-tabs'

import 'mui-tabs/dist/main.css'

const App = () => {
  const [value, setValue] = React.useState(1)

  return (
    <Tabs
      value={value}
      onChange={(value) => setValue(value)}
      TabIndicatorProps={{ style: { backgroundColor: 'purple' } }}
    >
      <Tab value={1} label="Tab 1" style={{ color: 'green' }} />
      <Tab value={2} label="Tab 2" style={{ color: 'orangered' }} />
    </Tabs>
  )
}
`

export const disabledTab = `
import * as React from 'react'
import { Tab, Tabs } from 'mui-tabs'

import 'mui-tabs/dist/main.css'

const App = () => {
  const [value, setValue] = React.useState(1)

  return (
    <Tabs value={value} onChange={(value) => setValue(value)}>
      <Tab value={1} label="Tab 1" />
      <Tab value={2} label="Tab 2" disabled />
      <Tab value={3} label="Tab 3" />
    </Tabs>
  )
}
`

export const fullWidthTabs = `
import * as React from 'react'
import { Tab, Tabs } from 'mui-tabs'

import 'mui-tabs/dist/main.css'

const App = () => {
  const [value, setValue] = React.useState(1)

  return (
    <Tabs
      value={value}
      variant="fullWidth"
      onChange={(value) => setValue(value)}
    >
      <Tab value={1} label="Tab 1" />
      <Tab value={2} label="Tab 2" />
      <Tab value={3} label="Tab 3" />
    </Tabs>
  )
}
`

export const centeredTabs = `
import * as React from 'react'
import { Tab, Tabs } from 'mui-tabs'

import 'mui-tabs/dist/main.css'

const App = () => {
  const [value, setValue] = React.useState(1)

  return (
    <Tabs value={value} onChange={(value) => setValue(value)} centered>
      <Tab value={1} label="Tab 1" />
      <Tab value={2} label="Tab 2" />
      <Tab value={3} label="Tab 3" />
    </Tabs>
  )
}
`

export const automaticScrollButtons = `
import * as React from 'react'
import { Tab, Tabs } from 'mui-tabs'

import 'mui-tabs/dist/main.css'

const App = () => {
  const [value, setValue] = React.useState(1)

  return (
    <Tabs
      value={value}
      onChange={(value) => setValue(value)}
      variant="scrollable"
      scrollButtons="auto"
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
`

export const forcedScrollButtons = `
import * as React from 'react'
import { Tab, Tabs } from 'mui-tabs'

import 'mui-tabs/dist/main.css'

const App = () => {
  const [value, setValue] = React.useState(1)

  return (
    <Tabs
      value={value}
      onChange={(value) => setValue(value)}
      variant="scrollable"
      scrollButtons={true}
      allowScrollButtonsMobile
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
`

export const preventScrollButtons = `
import * as React from 'react'
import { Tab, Tabs } from 'mui-tabs'

import 'mui-tabs/dist/main.css'

const App = () => {
  const [value, setValue] = React.useState(1)

  return (
    <Tabs
      value={value}
      onChange={(value) => setValue(value)}
      variant="scrollable"
      scrollButtons={false}
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
`

export const verticalTabs = `
import * as React from 'react'
import { Tab, Tabs } from 'mui-tabs'

import 'mui-tabs/dist/main.css'

const App = () => {
  const [value, setValue] = React.useState(1)

  return (
    <div style={{ flexGrow: 1, display: 'flex', height: 224 }}>
      <Tabs
        value={value}
        onChange={(value) => setValue(value)}
        variant="scrollable"
        orientation="vertical"
        scrollButtons={true}
        allowScrollButtonsMobile
      >
        <Tab value={1} label="Tab 1" />
        <Tab value={2} label="Tab 2" />
        <Tab value={3} label="Tab 3" />
        <Tab value={4} label="Tab 4" />
        <Tab value={5} label="Tab 5" />
        <Tab value={6} label="Tab 6" />
        <Tab value={7} label="Tab 7" />
      </Tabs>
      <div style={{ padding: 20 }}>Selected tab: {value}</div>
    </div>
  )
}
`

export const iconTabs = `
import * as React from 'react'
import { Tab, Tabs } from 'mui-tabs'

import 'mui-tabs/dist/main.css'

const Icon = ({ children }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height="25px"
    width="25px"
    xmlns="http://www.w3.org/2000/svg"
  >
    {children}
  </svg>
)

const HomeIcon = () => (
  <Icon>
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </Icon>
)

const ChatBubble = () => (
  <Icon>
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
  </Icon>
)

const ExploreIcon = () => (
  <Icon>
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z" />
  </Icon>
)

const SearchIcon = () => (
  <Icon>
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </Icon>
)

const App = () => {
  const [value, setValue] = React.useState(1)

  return (
    <Tabs value={value} onChange={(value) => setValue(value)} centered>
      <Tab value={1} icon={<HomeIcon />} />
      <Tab value={2} icon={<ChatBubble />} />
      <Tab value={3} icon={<ExploreIcon />} />
      <Tab value={4} icon={<SearchIcon />} />
    </Tabs>
  )
}
`

export const iconTabs2 = `
import * as React from 'react'
import { Tab, Tabs } from 'mui-tabs'

import 'mui-tabs/dist/main.css'

const Icon = ({ children }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height="25px"
    width="25px"
    xmlns="http://www.w3.org/2000/svg"
  >
    {children}
  </svg>
)

const HomeIcon = () => (
  <Icon>
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </Icon>
)

const ChatBubble = () => (
  <Icon>
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
  </Icon>
)

const ExploreIcon = () => (
  <Icon>
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z" />
  </Icon>
)

const SearchIcon = () => (
  <Icon>
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </Icon>
)

const App = () => {
  const [value, setValue] = React.useState(1)

  return (
    <Tabs value={value} onChange={(value) => setValue(value)} centered>
      <Tab value={1} label="Tab 1" icon={<HomeIcon />} />
      <Tab value={2} label="Tab 2" icon={<ChatBubble />} />
      <Tab value={3} label="Tab 3" icon={<ExploreIcon />} />
      <Tab value={4} label="Tab 4" icon={<SearchIcon />} />
    </Tabs>
  )
}
`

export const iconPositionTabs = `
import * as React from 'react'
import { Tab, Tabs } from 'mui-tabs'

import 'mui-tabs/dist/main.css'

const Icon = ({ children }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height="25px"
    width="25px"
    xmlns="http://www.w3.org/2000/svg"
  >
    {children}
  </svg>
)

const HomeIcon = () => (
  <Icon>
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </Icon>
)

const ChatBubble = () => (
  <Icon>
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
  </Icon>
)

const ExploreIcon = () => (
  <Icon>
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z" />
  </Icon>
)

const SearchIcon = () => (
  <Icon>
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </Icon>
)

const App = () => {
  const [value, setValue] = React.useState(1)

  return (
    <Tabs value={value} onChange={(value) => setValue(value)} centered>
      <Tab value={1} label="Tab 1" icon={<HomeIcon />} />
      <Tab value={2} label="Tab 2" icon={<ChatBubble />} iconPosition="start" />
      <Tab value={3} label="Tab 3" icon={<ExploreIcon />} iconPosition="end" />
      <Tab value={4} label="Tab 4" icon={<SearchIcon />} iconPosition="bottom" />
    </Tabs>
  )
}
`

export const customizationWithRippleEffect = `
import * as React from 'react'
import { Tab, Tabs } from 'mui-tabs'
import RippleButton from 'mui-tabs/RippleButton'

import 'mui-tabs/dist/main.css'
import 'mui-tabs/dist/ripple.css'
// or import 'mui-tabs/dist/all.css'

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
`

export const customizationWithStyledComponents = `
import * as React from 'react'
import styled from 'styled-components'
import { Tab, Tabs } from 'mui-tabs'
import tabClasses from 'mui-tabs/Tab/tabClasses'
import tabsClasses from 'mui-tabs/Tabs/tabsClasses'

import 'mui-tabs/dist/main.css'

const CustomTab = styled(Tab)({
  color: 'orange',
  [\`&.\${tabClasses.selected}\`]: {
    color: '#fff'
  }
})

const CustomTabs = styled(Tabs)({
  backgroundColor: '#2a2827',
  [\`.\${tabsClasses.scroller} .\${tabsClasses.indicator}\`]: {
    height: 4,
    backgroundColor: 'red'
  }
})

const App = () => {
  const [value, setValue] = React.useState(1)

  return (
    <CustomTabs value={value} onChange={(value) => setValue(value)}>
      <CustomTab value={1} label="Tab 1" />
      <CustomTab value={2} label="Tab 2" />
    </CustomTabs>
  )
}
`

export const customizationWithScssVariables = `
// see https://sass-lang.com/documentation/variables#configuring-modules
@use '~mui-tabs/dist/scss/main' with (
  $indicator-size: 3px,
  $indicator-color: blue
);
`
