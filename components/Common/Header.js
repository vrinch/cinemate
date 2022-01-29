
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, } from '@expo/vector-icons';
import { colors, } from '../../constants/theme';

const {
  WHITE,
} = colors;

const Header = ({ disabled, onPressBack, title, showRight, onPressRight, iconName, }) => (
  <View style={styles.container}>
    <View style={styles.boxWrapper}>
      <TouchableOpacity
        style={styles.backButton}
        disabled={disabled}
        onPress={onPressBack}
      >
        <Ionicons color={WHITE} size={30} name={iconName} />
      </TouchableOpacity>
    </View>
    <Text style={styles.titleStyle} numberOfLines={1}>{title}</Text>
      <View style={styles.boxWrapper}>
        {showRight &&
          <TouchableOpacity onPress={onPressRight} />
        }
      </View>
  </View>
);


const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  boxWrapper: {
    flex: 0.15,
    justifyContent: 'center',
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  titleStyle: {
    fontFamily: 'CircularMedium',
    fontSize: 17,
    color: WHITE,
    paddingVertical: 20,
    textAlign: 'center',
  },
});


export default Header;
