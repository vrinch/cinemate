
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { Button, BottomSheet } from '../Common';
import { colors, } from '../../constants/theme';


const {
  ERROR,
} = colors;

const SignOut = ({ disabledPanSwipe, onPressSignOut, onPressDelete,
  isLoadingSignout, isLoadingDelete, disabled, ...props }) => {
  return (
    <View style={styles.container}>
      <BottomSheet disabled={disabledPanSwipe} {...props}>
        <Button
          showRight
          title={'Confirm Sign Out'}
          style={{ marginBottom: 5 }}
          onPress={onPressSignOut}
          disabled={disabled}
          isLoading={isLoadingSignout}
        />
        <Button
          showRight
          title={'Delete Tag'}
          style={{ marginBottom: 5 }}
          onPress={onPressDelete}
          buttonColor={ERROR}
          disabled={disabled}
          isLoading={isLoadingDelete}
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

export default SignOut;
