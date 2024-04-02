import * as React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Example } from './components';
import { Tabs } from 'mui-tabs/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import RippleButton from 'mui-tabs/native/RippleButton';

const generateTabs = (count: number, label = true) => {
  return Array.from({ length: count }).map((_, index) => ({
    value: index + 1,
    ...(label ? { label: `Tab ${index + 1}` } : null)
  }));
};

const TabsExample = () => (
  <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
    <Example title="Basic tabs" description="A basic example with tab panels.">
      {({ value, onChange, initialLayoutWidth }) => (
        <Tabs
          tabs={generateTabs(3)}
          value={value}
          onChange={onChange}
          initialLayoutWidth={initialLayoutWidth}
        />
      )}
    </Example>

    <Example title="Colored tab">
      {({ value, onChange, initialLayoutWidth }) => (
        <Tabs
          tabs={generateTabs(3)}
          value={value}
          onChange={onChange}
          indicatorStyle={{
            backgroundColor: 'purple'
          }}
          renderTabLabel={({ item, style, selected }) => (
            <Text style={[style, selected ? { color: 'purple' } : null]}>
              {item.label}
            </Text>
          )}
          initialLayoutWidth={initialLayoutWidth}
        />
      )}
    </Example>

    <Example
      title="Disabled tab"
      description={'A tab can be disabled by setting the "disabled" prop.'}
    >
      {({ value, onChange, initialLayoutWidth }) => (
        <Tabs
          tabs={generateTabs(3).map((tab) => ({
            ...tab,
            disabled: tab.value === 2
          }))}
          value={value}
          onChange={onChange}
          tabStyle={{
            width: 'auto'
          }}
          initialLayoutWidth={initialLayoutWidth}
        />
      )}
    </Example>

    <Example
      title="Scrollable tabs"
      description={
        'You can divide large views into parts using scrollable={true} tabs.'
      }
    >
      {({ value, onChange, initialLayoutWidth }) => (
        <Tabs
          tabs={generateTabs(10)}
          value={value}
          scrollable={true}
          onChange={onChange}
          tabStyle={{
            width: 'auto'
          }}
          initialLayoutWidth={initialLayoutWidth}
        />
      )}
    </Example>

    <Example
      title="Icon tabs (All icons)"
      description="Tab labels may be either all icons."
    >
      {({ value, onChange, initialLayoutWidth }) => (
        <Tabs
          tabs={generateTabs(3, false)}
          value={value}
          onChange={onChange}
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
          initialLayoutWidth={initialLayoutWidth}
        />
      )}
    </Example>

    <Example
      title="Icon tabs (Icons and text)"
      description="Tab labels may be either all icons or all text."
    >
      {({ value, onChange, initialLayoutWidth }) => (
        <Tabs
          tabs={[
            {
              value: 1,
              label: 'Home'
            },
            {
              value: 2,
              label: 'Favorites'
            },
            {
              value: 3,
              label: 'Account'
            }
          ]}
          value={value}
          onChange={onChange}
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
          initialLayoutWidth={initialLayoutWidth}
        />
      )}
    </Example>

    <Example
      title="Badge tabs"
      description="Tabs can be used together with badges."
    >
      {({ value, onChange, initialLayoutWidth }) => (
        <Tabs
          tabs={generateTabs(3)}
          value={value}
          onChange={onChange}
          renderTabBadge={({ item, color }) => (
            <Text style={{ color }}>{item.value}</Text>
          )}
          initialLayoutWidth={initialLayoutWidth}
        />
      )}
    </Example>

    <Example
      title="Badge tabs (All icons)"
      description="Tab badges can be used together with icons."
    >
      {({ value, onChange, initialLayoutWidth }) => (
        <Tabs
          tabs={generateTabs(3, false)}
          value={value}
          onChange={onChange}
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
          renderTabBadge={({ item, color }) => (
            <Text style={{ color }}>{item.value}</Text>
          )}
          initialLayoutWidth={initialLayoutWidth}
        />
      )}
    </Example>

    <Example
      title="Badge tabs (Icons and text)"
      description="Tab badges can be used in combination with icons and text."
    >
      {({ value, onChange, initialLayoutWidth }) => (
        <Tabs
          tabs={generateTabs(3)}
          value={value}
          onChange={onChange}
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
          renderTabBadge={({ item, color }) => (
            <Text style={{ color }}>{item.value}</Text>
          )}
          initialLayoutWidth={initialLayoutWidth}
        />
      )}
    </Example>

    <Example
      title="Ripple Button"
      description="TabComponent={RippleButton} are used to give ripple effect."
    >
      {({ value, onChange, initialLayoutWidth }) => (
        <Tabs
          tabs={generateTabs(3)}
          value={value}
          onChange={onChange}
          tabComponent={RippleButton}
          initialLayoutWidth={initialLayoutWidth}
        />
      )}
    </Example>

    <Example title="Custom styling">
      {({ value, onChange, initialLayoutWidth }) => (
        <Tabs
          tabs={generateTabs(10)}
          value={value}
          onChange={onChange}
          scrollable={true}
          style={{
            backgroundColor: 'rgb(104, 110, 125)'
          }}
          tabStyle={{
            width: 'auto'
          }}
          labelStyle={{
            color: '#ffffff'
          }}
          indicatorStyle={{
            height: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.5)'
          }}
          pressColor="rgba(255, 255, 255, .32)"
          tabComponent={RippleButton}
          initialLayoutWidth={initialLayoutWidth}
        />
      )}
    </Example>

    <Example title="Custom indicator">
      {({ value, onChange, initialLayoutWidth }) => (
        <Tabs
          tabs={generateTabs(10)}
          value={value}
          onChange={onChange}
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
          initialLayoutWidth={initialLayoutWidth}
        />
      )}
    </Example>
  </ScrollView>
);

const styles = StyleSheet.create({
  scrollViewContentContainer: {
    flexGrow: 1,
    paddingVertical: 15
  }
});

export default TabsExample;
