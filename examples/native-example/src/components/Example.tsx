import * as React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import Title from './Title';
import Paragraph from './Paragraph';
import jsxToString from 'react-element-to-jsx-string';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';

const exampleToCode = (node: React.ReactNode): string => {
  return jsxToString(node, {
    tabStop: 2,
    sortProps: false,
    showFunctions: true,
    functionValue: (fn: any) => fn?.name || 'unknown',
    useBooleanShorthandSyntax: false
  })
    .replace(/No Display Name/g, 'Tabs')
    .replace(/value=\{[0-9]+}/, 'value={value}')
    .replace(/<Icon/g, '<IonIcon');
};

export interface ExampleProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: (props: {
    value: number;
    onChange: React.Dispatch<number>;
  }) => React.ReactNode;
}

const Example: React.FC<ExampleProps> = (props: ExampleProps) => {
  const { children, title, description } = props;
  const [value, setValue] = React.useState<number>(0);

  const renderedContent = children({
    value,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    onChange: (value) => setValue(value)
  });

  const handleCopyCode = () => {
    Clipboard.setString(exampleToCode(renderedContent));
  };

  return (
    <View style={styles.container}>
      {title ? <Title>{title}</Title> : null}
      {description ? <Paragraph>{description}</Paragraph> : null}
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <View style={{ marginTop: 5 }}>
        {renderedContent}
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <View style={{ marginTop: 10 }}>
          <Paragraph>Selected tab: {value + 1}</Paragraph>
          <View style={styles.copySourceCodeContainer}>
            <Pressable style={styles.copySourceCode} onPress={handleCopyCode}>
              <Text style={styles.copySourceCodeText}>
                <IonIcon name="clipboard-outline" size={15} /> Copy Source Code
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500'
  },
  copySourceCodeContainer: {
    marginTop: 10,
    alignItems: 'center'
  }
});

export default Example;
