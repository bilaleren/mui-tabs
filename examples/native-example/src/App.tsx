import * as React from 'react';
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import { Example } from './components';
import { Tab, Tabs } from 'mui-tabs/native';
import RippleButton from 'mui-tabs/native/RippleButton';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { repository as githubRepoUrl } from '../package.json';

const ViewOnGithubButton: React.FC = () => (
  <TouchableOpacity
    style={styles.viewOnGithubButton}
    onPress={() => Linking.openURL(githubRepoUrl)}
  >
    <IonIcon name="logo-github" size={40} />
    <Text>View On Github</Text>
  </TouchableOpacity>
);

const App: React.FC = () => (
  <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
      <ViewOnGithubButton />

      <Example
        title="Basic tabs"
        description="A basic example with tab panels."
      >
        {({ value, onChange }) => (
          <Tabs value={value} onChange={onChange}>
            <Tab label="Tab 1" />
            <Tab label="Tab 2" />
            <Tab label="Tab 3" />
          </Tabs>
        )}
      </Example>

      <Example title="Colored tab">
        {({ value, onChange }) => (
          <Tabs
            value={value}
            onChange={onChange}
            tabProps={{
              selectedColor: 'purple'
            }}
            indicatorProps={{ color: 'purple' }}
          >
            <Tab label="Tab 1" />
            <Tab label="Tab 2" />
            <Tab label="Tab 3" />
          </Tabs>
        )}
      </Example>

      <Example
        title="Disabled tab"
        description={'A tab can be disabled by setting the "disabled" prop.'}
      >
        {({ value, onChange }) => (
          <Tabs value={value} onChange={onChange}>
            <Tab label="Tab 1" />
            <Tab label="Tab 2" disabled={true} />
            <Tab label="Tab 3" />
          </Tabs>
        )}
      </Example>

      <Example
        title="Full width"
        description={
          'The variant="fullWidth" prop should be used for smaller views.'
        }
      >
        {({ value, onChange }) => (
          <Tabs value={value} variant="fullWidth" onChange={onChange}>
            <Tab label="Tab 1" />
            <Tab label="Tab 2" />
            <Tab label="Tab 3" />
          </Tabs>
        )}
      </Example>

      <Example
        title="Scrollable tabs"
        description={
          'You can divide large views into parts using variant="scrollable" tabs.'
        }
      >
        {({ value, onChange }) => (
          <Tabs value={value} variant="scrollable" onChange={onChange}>
            <Tab label="Tab 1" />
            <Tab label="Tab 2" />
            <Tab label="Tab 3" />
            <Tab label="Tab 4" />
            <Tab label="Tab 5" />
            <Tab label="Tab 6" />
            <Tab label="Tab 7" />
          </Tabs>
        )}
      </Example>

      <Example
        title="Scroll buttons"
        description={
          'Left and right scroll buttons be presented (reserve space) regardless of the viewport width with scrollButtons={true}.'
        }
      >
        {({ value, onChange }) => (
          <Tabs
            value={value}
            variant="scrollable"
            onChange={onChange}
            scrollButtons={true}
            scrollButtonProps={{
              iconImage: IonIcon.getImageSourceSync('chevron-back', 18)
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
        )}
      </Example>

      <Example
        title="Icon tabs (All icons)"
        description="Tab labels may be either all icons."
      >
        {({ value, onChange }) => (
          <Tabs value={value} onChange={onChange}>
            <Tab icon={<IonIcon name="home-outline" size={24} />} />
            <Tab icon={<IonIcon name="heart-outline" size={24} />} />
            <Tab icon={<IonIcon name="person-outline" size={24} />} />
          </Tabs>
        )}
      </Example>

      <Example
        title="Icon tabs (Icons and text)"
        description="Tab labels may be either all icons or all text."
      >
        {({ value, onChange }) => (
          <Tabs value={value} onChange={onChange}>
            <Tab
              icon={<IonIcon name="home-outline" size={24} />}
              label="Home"
            />
            <Tab
              icon={<IonIcon name="heart-outline" size={24} />}
              label="Favorites"
            />
            <Tab
              icon={<IonIcon name="person-outline" size={24} />}
              label="Account"
            />
          </Tabs>
        )}
      </Example>

      <Example
        title="Icon position"
        description="By default, the icon is positioned at the top of a tab. Other supported positions are start, end, bottom."
      >
        {({ value, onChange }) => (
          <Tabs value={value} variant="scrollable" onChange={onChange}>
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
        )}
      </Example>

      <Example
        title="Ripple Button"
        description="TabComponent={RippleButton} and ScrollButtonComponent={RippleButton} are used to give ripple effect."
      >
        {({ value, onChange }) => (
          <Tabs
            value={value}
            variant="scrollable"
            onChange={onChange}
            scrollButtons={true}
            TabComponent={RippleButton}
            ScrollButtonComponent={RippleButton}
            scrollButtonProps={{
              iconImage: IonIcon.getImageSourceSync('chevron-back', 18)
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
        )}
      </Example>

      <Example
        title="Custom colors"
        description="Custom colors can be set via style, tabProps and indicatorProps."
      >
        {({ value, onChange }) => (
          <Tabs
            value={value}
            variant="scrollable"
            onChange={onChange}
            style={{
              backgroundColor: 'rgb(104, 110, 125)'
            }}
            tabProps={{
              color: '#ffffff',
              selectedColor: '#ffffff'
            }}
            indicatorProps={{
              size: 3,
              color: 'rgba(255, 255, 255, 0.5)'
            }}
            scrollButtons={true}
            TabComponent={RippleButton}
            ScrollButtonComponent={RippleButton}
            scrollButtonProps={{
              iconImage: IonIcon.getImageSourceSync('chevron-back', 18),
              iconColor: '#ffffff'
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
        )}
      </Example>

      <Example title="Custom indicator">
        {({ value, onChange }) => (
          <Tabs
            value={value}
            variant="scrollable"
            onChange={onChange}
            style={{
              borderRadius: 99,
              backgroundColor: '#f2f2f2'
            }}
            tabProps={{
              color: '#000000',
              selectedColor: '#000000'
            }}
            indicatorProps={{
              size: '100%',
              color: '#ffffff',
              style: {
                zIndex: -1,
                borderRadius: 99
              }
            }}
            scrollButtons={true}
            scrollButtonProps={{
              iconImage: IonIcon.getImageSourceSync('chevron-back', 18)
            }}
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
        )}
      </Example>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  viewOnGithubButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginBottom: 20
  },
  scrollViewContentContainer: {
    paddingVertical: 15
  }
});

export default App;
