import * as React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

const Paragraph: React.FC<TextProps> = (props: TextProps) => {
  const { style, children, ...other } = props;

  return (
    <Text {...other} style={[styles.paragraph, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  paragraph: {
    color: '#000',
    fontSize: 16,
    fontWeight: '400'
  }
});

export default Paragraph;
