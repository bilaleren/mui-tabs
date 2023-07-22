import React from 'react'
import {
  Text,
  View,
  Pressable,
  ScrollView,
  StyleSheet,
  TextProps
} from 'react-native'
import { Tab, Tabs } from 'mui-tabs/native'
import jsxToString from 'react-element-to-jsx-string'
import RippleButton from 'mui-tabs/native/RippleButton'
import Clipboard from '@react-native-clipboard/clipboard'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const Title: React.FC<TextProps> = (props: TextProps) => {
  const { style, children, ...other } = props

  return (
    <Text {...other} style={[styles.title, style]}>
      {children}
    </Text>
  )
}

const Paragraph: React.FC<TextProps> = (props: TextProps) => {
  const { style, children, ...other } = props

  return (
    <Text {...other} style={[styles.paragraph, style]}>
      {children}
    </Text>
  )
}

interface ExampleProps {
  title?: React.ReactNode
  description?: React.ReactNode
  children: (value: number, setValue: React.Dispatch<number>) => React.ReactNode
}

function getCode(content: React.ReactNode): string {
  return jsxToString(content, {
    tabStop: 2,
    showFunctions: true,
    functionValue(fn) {
      return fn.name
    },
    sortProps: false,
    useBooleanShorthandSyntax: false
  })
    .replace(/No Display Name/g, 'Tabs')
    .replace(/value={[0-9]+}/, 'value={value}')
    .replace(/<Icon/g, '<MaterialCommunityIcons')
}

const Example: React.FC<ExampleProps> = (props: ExampleProps) => {
  const { children, title, description } = props
  const [value, setValue] = React.useState<number>(0)
  const renderedContent = children(value, setValue)

  return (
    <View style={styles.exampleContainer}>
      {title ? <Title>{title}</Title> : null}
      {description ? <Paragraph>{description}</Paragraph> : null}
      <View style={{ marginTop: 5 }}>
        {renderedContent}
        <View style={{ marginTop: 10 }}>
          <Paragraph>Selected tab: {value + 1}</Paragraph>
          <View style={styles.copySourceCodeContainer}>
            <Pressable
              style={styles.copySourceCode}
              onPress={() => Clipboard.setString(getCode(renderedContent))}
            >
              <Text style={styles.copySourceCodeText}>
                <MaterialCommunityIcons name="content-copy" size={15} /> Copy
                Source Code
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  )
}

const App: React.FC = () => (
  <ScrollView
    contentInsetAdjustmentBehavior="automatic"
    contentContainerStyle={{ paddingVertical: 20 }}
  >
    <Example title="Basic tabs" description="A basic example with tab panels.">
      {(value, setValue) => (
        <Tabs<number>
          value={value}
          onChange={(value: number) => setValue(value)}
        >
          <Tab label="1" />
          <Tab label="2" />
          <Tab label="3" />
        </Tabs>
      )}
    </Example>

    <Example title="Colored tab">
      {(value, setValue) => (
        <Tabs<number>
          value={value}
          indicatorProps={{ color: 'rgb(156, 39, 176)' }}
          tabProps={{
            color: 'rgb(156, 39, 176)',
            selectedColor: 'rgb(156, 39, 176)'
          }}
          onChange={(value: number) => setValue(value)}
        >
          <Tab label="1" />
          <Tab label="2" />
          <Tab label="3" />
        </Tabs>
      )}
    </Example>

    <Example
      title="Disabled tab"
      description='A tab can be disabled by setting the "disabled" prop.'
    >
      {(value, setValue) => (
        <Tabs<number>
          value={value}
          onChange={(value: number) => setValue(value)}
        >
          <Tab label="1" />
          <Tab label="2" disabled={true} />
          <Tab label="3" />
        </Tabs>
      )}
    </Example>

    <Example
      title="Full width"
      description='The variant="fullWidth" prop should be used for smaller views.'
    >
      {(value, setValue) => (
        <Tabs<number>
          value={value}
          variant="fullWidth"
          onChange={(value: number) => setValue(value)}
        >
          <Tab label="1" />
          <Tab label="2" />
          <Tab label="3" />
        </Tabs>
      )}
    </Example>

    <Example
      title="Scrollable tabs"
      description='You can divide large views into parts using variant="scrollable" tabs.'
    >
      {(value, setValue) => (
        <Tabs<number>
          value={value}
          variant="scrollable"
          onChange={(value: number) => setValue(value)}
        >
          <Tab label="1" />
          <Tab label="2" />
          <Tab label="3" />
          <Tab label="4" />
          <Tab label="5" />
          <Tab label="6" />
        </Tabs>
      )}
    </Example>

    <Example
      title="Scroll buttons"
      description="Left and right scroll buttons be presented (reserve space) regardless of the viewport width with scrollButtons={true}."
    >
      {(value, setValue) => (
        <Tabs<number>
          value={value}
          variant="scrollable"
          scrollButtons={true}
          onChange={(value: number) => setValue(value)}
        >
          <Tab label="1" />
          <Tab label="2" />
          <Tab label="3" />
          <Tab label="4" />
          <Tab label="5" />
          <Tab label="6" />
        </Tabs>
      )}
    </Example>

    <Example
      title="Centered tabs"
      description='The "centered" prop should be used for larger views.'
    >
      {(value, setValue) => (
        <Tabs<number>
          value={value}
          centered={true}
          onChange={(value: number) => setValue(value)}
        >
          <Tab label="1" />
          <Tab label="2" />
          <Tab label="3" />
        </Tabs>
      )}
    </Example>

    <Example
      title="Icon tabs (All icons)"
      description="Tab labels may be either all icons."
    >
      {(value, setValue) => (
        <Tabs<number>
          value={value}
          centered={true}
          onChange={(value: number) => setValue(value)}
        >
          <Tab icon={<MaterialCommunityIcons name="home" size={25} />} />
          <Tab icon={<MaterialCommunityIcons name="heart" size={25} />} />
          <Tab icon={<MaterialCommunityIcons name="magnify" size={25} />} />
        </Tabs>
      )}
    </Example>

    <Example
      title="Icon tabs (Icons and text)"
      description="Tab labels may be either all icons or all text."
    >
      {(value, setValue) => (
        <Tabs<number>
          value={value}
          centered={true}
          onChange={(value: number) => setValue(value)}
        >
          <Tab
            label="1"
            icon={<MaterialCommunityIcons name="home" size={25} />}
          />
          <Tab
            label="2"
            icon={<MaterialCommunityIcons name="heart" size={25} />}
          />
          <Tab
            label="3"
            icon={<MaterialCommunityIcons name="magnify" size={25} />}
          />
        </Tabs>
      )}
    </Example>

    <Example
      title="Icon position"
      description="By default, the icon is positioned at the top of a tab. Other supported positions are start, end, bottom."
    >
      {(value, setValue) => (
        <Tabs<number>
          value={value}
          centered={true}
          onChange={(value: number) => setValue(value)}
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
      )}
    </Example>

    <Example
      title="Ripple Button"
      description="TabComponent={RippleButton} and ScrollButtonComponent={RippleButton} are used to give ripple effect."
    >
      {(value, setValue) => (
        <Tabs<number>
          value={value}
          variant="scrollable"
          scrollButtons={true}
          TabComponent={RippleButton}
          ScrollButtonComponent={RippleButton}
          onChange={(value: number) => setValue(value)}
        >
          <Tab label="1" />
          <Tab label="2" />
          <Tab label="3" />
          <Tab label="4" />
          <Tab label="5" />
          <Tab label="6" />
        </Tabs>
      )}
    </Example>

    <Example title="Custom tabs 1">
      {(value, setValue) => (
        <Tabs<number>
          style={{ backgroundColor: 'rgb(104, 110, 125)' }}
          value={value}
          variant="scrollable"
          scrollButtons={true}
          tabProps={{
            color: '#fff',
            selectedColor: '#fff'
          }}
          indicatorProps={{
            size: 3,
            color: 'rgba(255, 255, 255, 0.5)'
          }}
          scrollButtonsProps={{
            iconSize: 19,
            iconColor: '#fff'
          }}
          TabComponent={RippleButton}
          ScrollButtonComponent={RippleButton}
          onChange={(value: number) => setValue(value)}
        >
          <Tab label="1" />
          <Tab label="2" />
          <Tab label="3" />
          <Tab label="4" />
          <Tab label="5" />
          <Tab label="6" />
        </Tabs>
      )}
    </Example>

    <Example title="Custom tabs 2">
      {(value, setValue) => (
        <Tabs<number>
          value={value}
          variant="scrollable"
          tabProps={{
            width: 100
          }}
          onChange={(value: number) => setValue(value)}
        >
          <Tab label="Tab 1" width={120} />
          <Tab label="Tab 2" width={150} />
          <Tab label="Tab 3" width={100} />
          <Tab label="Tab 4" width={90} />
          <Tab label="Tab 5" width={200} />
          <Tab label="Tab 6" width={160} />
        </Tabs>
      )}
    </Example>

    <Example title="Custom tabs 3">
      {(value, setValue) => (
        <Tabs<number>
          value={value}
          insets={10}
          variant="scrollable"
          onChange={(value: number) => setValue(value)}
          scrollButtons={true}
          style={{
            maxHeight: 58,
            borderRadius: 99,
            backgroundColor: '#f2f2f2'
          }}
          indicatorProps={{
            size: '100%',
            color: '#fff',
            style: {
              zIndex: 1,
              bottom: 5,
              borderRadius: 99
            }
          }}
          tabProps={{
            color: '#000',
            selectedColor: '#000',
            style: {
              zIndex: 2,
              borderRadius: 99
            }
          }}
          scrollViewProps={{
            contentContainerStyle: {
              paddingVertical: 5,
              paddingHorizontal: 10 // insets={10}
            }
          }}
          scrollButtonsProps={{
            iconSize: 21,
            iconColor: '#000'
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
      )}
    </Example>

    <Example title="Custom tabs 4">
      {(value, setValue) => (
        <Tabs<number>
          value={value}
          tabSpace={30}
          onChange={(value: number) => setValue(value)}
          style={{
            maxHeight: 58,
            borderRadius: 99,
            backgroundColor: '#f2f2f2'
          }}
          indicatorProps={{
            size: '100%',
            color: '#fff',
            style: {
              zIndex: 1,
              borderRadius: 99
            }
          }}
          tabProps={{
            color: '#000',
            selectedColor: '#000',
            style: {
              zIndex: 2,
              borderRadius: 99
            }
          }}
          scrollViewContainerProps={{
            style: {
              paddingVertical: 5,
              paddingHorizontal: 10
            }
          }}
        >
          <Tab label="1" />
          <Tab label="2" />
          <Tab label="3" />
        </Tabs>
      )}
    </Example>

    <Example title="Custom tabs 5">
      {(value, setValue) => (
        <Tabs<number>
          value={value}
          insets={10}
          centered={true}
          onChange={(value: number) => setValue(value)}
          style={{
            maxHeight: 58,
            borderRadius: 99,
            backgroundColor: '#f2f2f2'
          }}
          indicatorProps={{
            size: '100%',
            color: '#fff',
            style: {
              zIndex: 1,
              borderRadius: 99
            }
          }}
          tabProps={{
            color: '#000',
            selectedColor: '#000',
            style: {
              zIndex: 2,
              borderRadius: 99
            }
          }}
          scrollViewContainerProps={{
            style: {
              paddingVertical: 5,
              paddingHorizontal: 10
            }
          }}
        >
          <Tab label="1" />
          <Tab label="2" />
          <Tab label="3" />
        </Tabs>
      )}
    </Example>
  </ScrollView>
)

const styles = StyleSheet.create({
  title: {
    color: '#000',
    fontSize: 19,
    fontWeight: 'bold'
  },
  paragraph: {
    color: '#000',
    fontSize: 16,
    fontWeight: '400'
  },
  exampleContainer: {
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#fff',
    marginBottom: 10
  },
  copySourceCode: {
    width: 180,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: '#7367F0FF'
  },
  copySourceCodeText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '500'
  },
  copySourceCodeContainer: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center'
  }
})

export default App
