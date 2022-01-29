
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Button from './Button';
import BottomSheet from './BottomSheet';

const UploadImage = ({ disabledPanSwipe, onPressPick, onPresTake, ...props }) => {
  return (
    <View style={styles.container}>
      <BottomSheet disabled={disabledPanSwipe} {...props}>
        <Button
          title={'Camera'}
          style={{ marginBottom: 5 }}
          onPress={onPresTake}
        />
        <Button
          title={'Gallery'}
          style={{ marginBottom: 5 }}
          onPress={onPressPick}
        />
      </BottomSheet>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default UploadImage;
