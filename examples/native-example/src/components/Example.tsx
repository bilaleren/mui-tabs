import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Title from './Title';
import Paragraph from './Paragraph';

export interface ExampleProps {
  title?: React.ReactNode;
  initialValue?: number;
  description?: React.ReactNode;
  children: (props: {
    value: number;
    onChange: React.Dispatch<number>;
    initialLayoutWidth: number;
  }) => React.ReactNode;
}

const PADDING_VERTICAL = 10;
const PADDING_HORIZONTAL = 10;
const MARGIN_HORIZONTAL = 10;

const Example: React.FC<ExampleProps> = (props: ExampleProps) => {
  const { children, title, description, initialValue = 1 } = props;

  const dimensions = Dimensions.get('window');
  const [value, setValue] = React.useState<number>(initialValue);

  const renderedContent = children({
    value,
    onChange: setValue,
    initialLayoutWidth:
      dimensions.width - (MARGIN_HORIZONTAL + PADDING_HORIZONTAL) * 2
  });

  return (
    <View style={styles.container}>
      {title ? <Title>{title}</Title> : null}
      {description ? <Paragraph>{description}</Paragraph> : null}
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <View style={{ marginTop: 5 }}>
        {renderedContent}
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <View style={{ marginTop: 10 }}>
          <Paragraph>Selected tab: {value}</Paragraph>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: MARGIN_HORIZONTAL,
    paddingVertical: PADDING_VERTICAL,
    paddingHorizontal: PADDING_HORIZONTAL,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#fff',
    marginBottom: 15
  }
});

export default Example;
