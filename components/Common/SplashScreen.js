
import React, { useState, useEffect, } from 'react';
import {
  StyleSheet,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { logo } from '../Images';
import { sizes, colors, } from '../../constants/theme';
import Layout from './Layout';


const { PRIMARY, SECONDARY, } = colors;

const SplashScreen = ({ appIsReady }) => {
  const [imageFadeValue] = useState(new Animated.Value(0));
  const [imageSlideValue] = useState(new Animated.Value(1));
  const [textFadeValue] = useState(new Animated.Value(0));
  const [textSlideValue] = useState(new Animated.Value(1.3));

  useEffect(() => {
    FadeImage();
    if (appIsReady) {
      SlideImage();
      FadeText();
      SlideText();
    }
  }, [appIsReady]);

  const FadeImage = () => {
    Animated.timing(imageFadeValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const FadeText = () => {
    Animated.timing(textFadeValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const SlideImage = () => {
   Animated.timing(imageSlideValue, {
     toValue: 1.1,
     duration: 1000,
     useNativeDriver: true,
   }).start();
 };

 const SlideText = () => {
  Animated.timing(textSlideValue, {
    toValue: 1,
    duration: 1000,
    useNativeDriver: true,
  }).start();
};

  return (
    <Layout
      style={styles.container}
      colors={[PRIMARY, SECONDARY]}
      start={[0, 1]}
      end={[1, 0]}
    >
      <StatusBar translucent backgroundColor='transparent' style="light" />
      <Animated.Image
        source={logo}
        style={[
          {
            transform: [
              {
                translateY: imageSlideValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0]
                })
              }
            ],
            opacity: imageFadeValue,
          },
          styles.imageStyle]}
        resizeMode={'contain'}
      />
      {appIsReady &&
        <Animated.Text
          style={[
            {
              transform: [
                {
                  translateY: textSlideValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0]
                  })
                }
              ],
              opacity: textFadeValue,
            },
            styles.textStyle]}
        >
          Cinemate
        </Animated.Text>
      }
    </Layout>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    width: 80,
    height: 80,
  },
  textStyle: {
    fontSize: sizes.h1 * 1.2,
    color: colors.WHITE,
    fontFamily: 'CircularMedium',
    paddingTop: 10,
  }
});

export default SplashScreen;
