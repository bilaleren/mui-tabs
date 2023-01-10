import * as React from 'react'
import styled from 'styled-components'
import Example from './components/Example'
import { Tab, Tabs, TabsProps } from 'mui-tabs'
import tabClasses from 'mui-tabs/Tab/tabClasses'
import RippleButton from 'mui-tabs/RippleButton'
import tabsClasses from 'mui-tabs/Tabs/tabsClasses'
import {
  basicTab,
  iconTabs,
  iconTabs2,
  coloredTab,
  disabledTab,
  fullWidthTabs,
  centeredTabs,
  verticalTabs,
  iconPositionTabs,
  forcedScrollButtons,
  preventScrollButtons,
  coloredTabWithTabStyle,
  automaticScrollButtons,
  customizationWithRippleEffect,
  customizationWithScssVariables,
  customizationWithStyledComponents
} from "./example-codes";

const Icon: React.FC = ({ children }) => (
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

const CustomTab = styled(Tab)({
  color: 'orange',
  [`&.${tabClasses.selected}`]: {
    color: '#fff'
  }
})

const CustomTabs = styled(Tabs)({
  backgroundColor: '#2a2827',
  [`.${tabsClasses.scroller} .${tabsClasses.indicator}`]: {
    height: 4,
    backgroundColor: 'red'
  }
}) as React.FC<TabsProps>

const App = () => (
  <>
    <h1 className="title">Material UI Tabs</h1>

    <p>
      <b>Material UI Tabs</b> make it easy to explore and switch between
      different views.
    </p>

    <Example title="Basic tabs" exampleCode={basicTab}>
      {(value, setValue) => (
        <Tabs value={value} onChange={(value: number) => setValue(value)}>
          <Tab value={1} label="Tab 1" />
          <Tab value={2} label="Tab 2" />
        </Tabs>
      )}
    </Example>

    <Example title="Colored tab" exampleCode={coloredTab}>
      {(value, setValue) => (
        <Tabs
          value={value}
          onChange={(value: number) => setValue(value)}
          TabProps={{ style: { color: 'purple' } }}
          TabIndicatorProps={{ style: { backgroundColor: 'purple' } }}
        >
          <Tab value={1} label="Tab 1" />
          <Tab value={2} label="Tab 2" />
        </Tabs>
      )}
    </Example>

    <Example
      title="With tab style"
      isSubExample
      exampleCode={coloredTabWithTabStyle}
    >
      {(value, setValue) => (
        <Tabs
          value={value}
          onChange={(value: number) => setValue(value)}
          TabIndicatorProps={{ style: { backgroundColor: 'purple' } }}
        >
          <Tab value={1} label="Tab 1" style={{ color: 'green' }} />
          <Tab value={2} label="Tab 2" style={{ color: 'orangered' }} />
        </Tabs>
      )}
    </Example>

    <Example
      title="Disabled tab"
      description="A tab can be disabled by setting the disabled prop."
      exampleCode={disabledTab}
    >
      {(value, setValue) => (
        <Tabs value={value} onChange={(value: number) => setValue(value)}>
          <Tab value={1} label="Tab 1" />
          <Tab value={2} label="Tab 2" disabled />
          <Tab value={3} label="Tab 3" />
        </Tabs>
      )}
    </Example>

    <Example
      title="Fixed tabs"
      description="Fixed tabs should be used with a limited number of tabs, and when a consistent placement will aid muscle memory."
    />

    <Example
      id="fullwidth-tabs"
      title="Full width"
      isSubExample
      description={
        'The variant="fullWidth" prop should be used for smaller views.'
      }
      exampleCode={fullWidthTabs}
    >
      {(value, setValue) => (
        <Tabs
          value={value}
          variant="fullWidth"
          onChange={(value: number) => setValue(value)}
        >
          <Tab value={1} label="Tab 1" />
          <Tab value={2} label="Tab 2" />
          <Tab value={3} label="Tab 3" />
        </Tabs>
      )}
    </Example>

    <Example
      id="centered-tabs"
      title="Centered"
      description="The centered prop should be used for larger views."
      exampleCode={centeredTabs}
    >
      {(value, setValue) => (
        <Tabs value={value} onChange={(value: number) => setValue(value)} centered>
          <Tab value={1} label="Tab 1" />
          <Tab value={2} label="Tab 2" />
          <Tab value={3} label="Tab 3" />
        </Tabs>
      )}
    </Example>

    <Example id="scrollable-tabs" title="Scrollable tabs" />

    <Example
      id="automatic-scroll-buttons"
      title="Automatic scroll buttons"
      isSubExample
      description="By default, left and right scroll buttons are automatically presented on desktop and hidden on mobile. (based on viewport width)"
      exampleCode={automaticScrollButtons}
      TabContainerProps={{ className: 'tab-container-center' }}
    >
      {(value, setValue) => (
        <Tabs
          value={value}
          onChange={(value: number) => setValue(value)}
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
      )}
    </Example>

    <Example
      title="Forced scroll buttons"
      isSubExample
      description="Left and right scroll buttons be presented (reserve space) regardless of the viewport width with scrollButtons={true} allowScrollButtonsMobile:"
      exampleCode={forcedScrollButtons}
      TabContainerProps={{ className: 'tab-container-center' }}
    >
      {(value, setValue) => (
        <Tabs
          value={value}
          onChange={(value: number) => setValue(value)}
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
      )}
    </Example>

    <Example
      title="Prevent scroll buttons"
      isSubExample
      description="Left and right scroll buttons are never be presented with scrollButtons={false}. All scrolling must be initiated through user agent scrolling mechanisms (e.g. left/right swipe, shift mouse wheel, etc.)"
      exampleCode={preventScrollButtons}
      TabContainerProps={{ className: 'tab-container-center' }}
    >
      {(value, setValue) => (
        <Tabs
          value={value}
          onChange={(value: number) => setValue(value)}
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
      )}
    </Example>

    <Example
      id="vertical-tabs"
      title="Vertical tabs"
      useTabContent={false}
      description={
        'To make vertical tabs instead of default horizontal ones, there is orientation="vertical"'
      }
      exampleCode={verticalTabs}
    >
      {(value, setValue) => (
        <div style={{ flexGrow: 1, display: 'flex', height: 224 }}>
          <Tabs
            value={value}
            onChange={(value: number) => setValue(value)}
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
          <div className="tab-content">Selected tab: {value}</div>
        </div>
      )}
    </Example>

    <Example
      id="icon-tabs"
      title="Icon tabs"
      description="Tab labels may be either all icons or text."
      exampleCode={iconTabs}
    >
      {(value, setValue) => (
        <Tabs value={value} onChange={(value: number) => setValue(value)} centered>
          <Tab value={1} icon={<HomeIcon />} />
          <Tab value={2} icon={<ChatBubble />} />
          <Tab value={3} icon={<ExploreIcon />} />
          <Tab value={4} icon={<SearchIcon />} />
        </Tabs>
      )}
    </Example>

    <Example
      id="icon-tabs-2"
      exampleCode={iconTabs2}
    >
      {(value, setValue) => (
        <Tabs value={value} onChange={(value: number) => setValue(value)} centered>
          <Tab value={1} label="Tab 1" icon={<HomeIcon />} />
          <Tab value={2} label="Tab 2" icon={<ChatBubble />} />
          <Tab value={3} label="Tab 3" icon={<ExploreIcon />} />
          <Tab value={4} label="Tab 4" icon={<SearchIcon />} />
        </Tabs>
      )}
    </Example>

    <Example
      title="Icon position"
      description="By default, the icon is positioned at the top of a tab. Other supported positions are start, end, bottom."
      exampleCode={iconPositionTabs}
    >
      {(value, setValue) => (
        <Tabs value={value} onChange={(value: number) => setValue(value)} centered>
          <Tab value={1} label="Tab 1" icon={<HomeIcon />} />
          <Tab
            value={2}
            label="Tab 2"
            icon={<ChatBubble />}
            iconPosition="start"
          />
          <Tab
            value={3}
            label="Tab 3"
            icon={<ExploreIcon />}
            iconPosition="end"
          />
          <Tab
            value={4}
            label="Tab 4"
            icon={<SearchIcon />}
            iconPosition="bottom"
          />
        </Tabs>
      )}
    </Example>

    <Example title="Customization" />

    <Example
      id="ripple-effect"
      title="Customization with ripple effect"
      isSubExample
      exampleCode={customizationWithRippleEffect}
      TabContainerProps={{ className: 'tab-container-center' }}
    >
      {(value, setValue) => (
        <Tabs
          value={value}
          variant="scrollable"
          onChange={(value: number) => setValue(value)}
          TabComponent={RippleButton}
          ScrollButtonComponent={RippleButton}
          scrollButtons={true}
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
      )}
    </Example>

    <Example
      title="Customization with scss variables"
      isSubExample
      defaultShowCode
      exampleCode={customizationWithScssVariables}
    />

    <Example
      title="Customization with styled-components or emotion"
      isSubExample
      exampleCode={customizationWithStyledComponents}
    >
      {(value, setValue) => (
        <CustomTabs value={value} onChange={(value: number) => setValue(value)}>
          <CustomTab value={1} label="Tab 1" />
          <CustomTab value={2} label="Tab 2" />
        </CustomTabs>
      )}
    </Example>
  </>
)

export default App
