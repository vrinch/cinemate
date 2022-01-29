
import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, } from '../../constants/theme';


const { TEXT_GREY, SECONDARY, } = colors;

const CategoryButton = ({ emoji, title, onPress, }) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.buttonWrapper} onPress={onPress}>
      <Text style={styles.emojiStyle}>
        {emoji}
      </Text>
    </TouchableOpacity>
    <Text style={styles.titleStyle}>
      {title}
    </Text>
  </View>
);

export default CategoryButton;

const styles = StyleSheet.create({
  container: {
    width: '17%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: SECONDARY,
    borderRadius: 20
  },
  emojiStyle: {
    fontSize: 30,
  },
  titleStyle: {
    fontFamily: 'CircularMedium',
    color: TEXT_GREY,
    fontSize: 13,
    paddingVertical: 10,
    textAlign: 'center',
  },
});
