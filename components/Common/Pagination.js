
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { colors, } from '../../constants/theme';

const {
  SECONDARY,
  TERTIARY,
} = colors;

const Pagination = ({ activeSlide, ...props }) => (
  <View style={activeSlide ? styles.active : styles.inactive} {...props} />
);


const styles = StyleSheet.create({
  active: {
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: TERTIARY,
    marginHorizontal: 10,
  },
  inactive: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: SECONDARY,
    marginHorizontal: 10,
  },
});

export default Pagination;
