import * as React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

const Title: React.FC<TextProps> = (props: TextProps) => {
  const { style, children, ...other } = props;

  return (
    <Text {...other} style={[styles.title, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#000',
    fontSize: 19,
    fontWeight: 'bold'
  }
});

export default Title;
