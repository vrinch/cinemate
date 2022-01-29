import React, { useEffect, useState, } from 'react';
import {
  View,
  StyleSheet,
  LogBox,
  Vibration,
  Modal,
  Animated,
} from 'react-native';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialIndicator } from 'react-native-indicators';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useNetInfo } from '@react-native-community/netinfo';
import {
  FontAwesome,
  Entypo,
  AntDesign,
  EvilIcons,
  Feather,
  FontAwesome5,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
  Octicons,
  Zocial,
  createIconSet
} from '@expo/vector-icons';
import Navigation from './navigation';
import store from './src/store';
import {
  SplashScreen as CustomSplashScreen,
  ErrorWrapper,
} from './components/Common';
import {
  logo,
  authImage,
} from './components/Images';
import {
  colors,
} from './constants/theme';

// import all used images
const images = [
  logo,
  authImage,
];

const {
  WHITE,
  ERROR,
} = colors;

const glyphMap = require('./assets/fonts/json/Fontisto.json');
const expoAssetId = require('./assets/fonts/Fontisto.ttf');

const Fontisto = createIconSet(glyphMap, 'Fontisto', expoAssetId);

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

const USER_DETAILS = 'USER_DETAILS';

const connectionMessage = 'Cinemate could not connect to the internet. Please check your internet connection and try again.';
export default function App() {
  LogBox.ignoreLogs(['Setting a timer']);
  const [modalVisible, setModalVisible] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [scaleViewAnimation] = useState(new Animated.Value(1.3));
  const [userDetails, setUserDetails] = useState([]);
  const netInfo = useNetInfo();


  useEffect(async () => {
    async function prepare() {
      try {
        await SplashScreen.hideAsync();
        const storedData = await AsyncStorage.getItem(USER_DETAILS);
        const parsedData = await JSON.parse(storedData);
        await setUserDetails(parsedData || []);
        await FontLoader();
        await ImageLoader();
      } catch (e) {
        console.warn(e);
      } finally {
        await setAppIsReady(true);
        setTimeout(() => {
          setModalVisible(false);
          HandleScaleAnimation();
        }, 2000);
      }
    }

    prepare();
  }, [])

  const FontLoader = async () => {
    await Font.loadAsync({
      CircularBlackItalic: require('./assets/fonts/CircularStd-BlackItalic.ttf'),
      CircularBoldItalic: require('./assets/fonts/CircularStd-BoldItalic.ttf'),
      CircularMediumItalic: require('./assets/fonts/CircularStd-MediumItalic.ttf'),
      CircularRegularItalic: require('./assets/fonts/CircularStd-RegularItalic.ttf'),
      CircularBlack: require('./assets/fonts/CircularStd-Black.ttf'),
      CircularBold: require('./assets/fonts/CircularStd-Bold.ttf'),
      CircularMedium: require('./assets/fonts/CircularStd-Medium.ttf'),
      CircularRegular: require('./assets/fonts/CircularStd-Regular.ttf'),
      Fontisto: require('./assets/fonts/Fontisto.ttf'),
    });
  }

  const ImageLoader = async () => {
    const cacheImages = images.map(image => Asset.fromModule(image).downloadAsync());

    const fontAssets = cacheFonts([
      FontAwesome.font,
      MaterialIcons.font,
      FontAwesome5.font,
      Octicons.font,
      MaterialCommunityIcons.font,
      SimpleLineIcons.font,
      Entypo.font,
      AntDesign.font,
      Ionicons.font,
      Foundation.font,
      EvilIcons.font,
      Zocial.font,
      Feather.font,
      Fontisto.font
    ]);

    return Promise.all([...cacheImages, ...fontAssets]);
  }

  const HandleScaleAnimation = () => {
    Animated.timing(scaleViewAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }




  return (
    <View style={styles.container}>
      <Provider store={store}>
        <NavigationContainer>
          {!modalVisible &&
            <Animated.View
              style={[{
                transform: [
                  {
                    scale: scaleViewAnimation
                  }
                ],
              }, styles.container]}
            >
              <Navigation userDetails={userDetails} />

              <ErrorWrapper
                backgroundColor={ERROR}
                errorMessage={connectionMessage}
                closeable={!netInfo.isConnected}
              />
            </Animated.View>
          }
          <Modal
            transparent
            visible={modalVisible}
            style={styles.modalStyle}
          >
            <CustomSplashScreen appIsReady={appIsReady} />
          </Modal>
        </NavigationContainer>
      </Provider>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101621',
  },
  modalStyle: {
    ...StyleSheet.absoluteFillObject,
  }
});
