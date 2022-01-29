
import React, { useState, useEffect, } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sizes, colors, } from '../../constants/theme';
import {
  authImage,
  logo,
} from '../../components/Images';
import { Button, ErrorWrapper, } from '../../components/Common';
import { Register, Login, } from '../../components/Auth';
import {
  getTagName,
  getTagStorage,
  getAllUserTagStorage,
  getBlackList,
  getAuthStatus,
  getProfileImage,
  getFavouriteMovies,
  getReservations,
} from '../../src/actions';

const {
  WHITE,
  ERROR,
  BUTTONCOLOR,
} = colors;

const USER_DETAILS = 'USER_DETAILS';

function Welcome({ navigation, getTagName, getTagStorage, getBlackList, getAuthStatus,
  getProfileImage, getFavouriteMovies, getReservations, getAllUserTagStorage,
  allUserTagStorage, }) {
  const [registerSheetVisible, setRegisterSheetVisible] = useState(false);
  const [loginSheetVisible, setLoginSheetVisible] = useState(false);
  const [tagName, setTagName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openErrorWrapper, setOpenErrorWrapper] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(async () => {
    try {
      const storedData = await AsyncStorage.getItem(USER_DETAILS);
      const parsedData = JSON.parse(storedData);
      setUserDetails(parsedData || []);
    } catch (e) {
      console.warn(e);
    }
  }, [allUserTagStorage]);

  const saveUserDetail = async (userData) => {
    await AsyncStorage.setItem(USER_DETAILS, JSON.stringify(userData));
  };

  const CHECK_STORAGE = allUserTagStorage.length > 0;
  const SELECT_ACTIVE_TAG_NAME = CHECK_STORAGE ? allUserTagStorage[0].tagName : '';


  const showSheet = () => {
    if (CHECK_STORAGE) {
      setTagName(SELECT_ACTIVE_TAG_NAME);
      setLoginSheetVisible(true);
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = () => {
    setTagName('');
    setRegisterSheetVisible(true);
  };

  const onChangeTagName = (name) => {
    setTagName(name.replace(/[^a-z0-9A-Z]/g, '').toLowerCase());
  };

  const handleLogin = () => {
    Keyboard.dismiss();
    setIsLoading(true);
    const filterAuthStatus = allUserTagStorage.filter((e) => e.tagName === tagName);
    const findTagIndex = allUserTagStorage.findIndex((e) => e.tagName === tagName);
    allUserTagStorage[findTagIndex].signedIn = true;

    getTagStorage(filterAuthStatus[0]);
    getTagName(tagName);
    getTagStorage(filterAuthStatus[0]);
    getTagName(filterAuthStatus[0].tagName);
    getBlackList(filterAuthStatus[0].blackList);
    getAuthStatus(filterAuthStatus[0].signedIn);
    getProfileImage(filterAuthStatus[0].profileImage);
    getFavouriteMovies(filterAuthStatus[0].favouriteMovies);
    getReservations(filterAuthStatus[0].reservations);
    getAllUserTagStorage(allUserTagStorage);
    saveUserDetail(allUserTagStorage);

    setTimeout(() => {
      setErrorMessage('');
      setOpenErrorWrapper(false);
      setIsLoading(false);
      navigation.navigate('MainScreen');
      setLoginSheetVisible(false);
    }, 2000);
  };

  const tagNameSelected = (name) => {
    const newTagName = name || tagName;
    setTagName(name || newTagName);
  };

  const handleRegister = () => {
    const filterTagName = allUserTagStorage.filter((e) => e.tagName === tagName);

    if (tagName.length < 3) {
      setErrorMessage('Your Cinemate tag cannot be less than 3 characters');
      setOpenErrorWrapper(true);
    } else if (filterTagName.length > 0) {
      setErrorMessage(`@${tagName} is already in use`);
      setOpenErrorWrapper(true);
    } else if (allUserTagStorage.length === 5) {
      setErrorMessage('You cannot have more that 5 Cinemate tag, kindly login to delete one of your current tag account');
      setOpenErrorWrapper(true);
    } else {
      Keyboard.dismiss();
      const newUserStorage = {
        tagName,
        favouriteMovies: [],
        reservations: [],
        blackList: [],
        profileImage: null,
        signedIn: true,
        timeCreated: Date.now(),
      };

      setIsLoading(true);

      setTimeout(() => {
        userDetails.push(newUserStorage);
        saveUserDetail(userDetails);
        setUserDetails(userDetails);
        setTagName('');
        setErrorMessage('');
        setOpenErrorWrapper(false);

        getAllUserTagStorage(userDetails);
        getTagName(tagName);
        getTagStorage(newUserStorage);
        getBlackList([]);
        getAuthStatus(true);
        getProfileImage(null);
        getFavouriteMovies([]);
        getReservations([]);

        setRegisterSheetVisible(false);
        setIsLoading(false);
        navigation.navigate('MainScreen');
      }, 2000);
    }
  };


  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor='transparent' style="light" />
      <ImageBackground
        style={styles.imageBackgroundContainer}
        source={authImage}
        resizeMode={'cover'}
      >
        {CHECK_STORAGE &&
          <TouchableOpacity
            onPress={handleGetStarted}
            disabled={registerSheetVisible || loginSheetVisible}
            style={styles.registerButtonStyle}
          >
            <Text style={styles.registerTextStyle}>Get Started</Text>
          </TouchableOpacity>
        }

        <Image source={logo} style={styles.logoStyle} resizeMode={'contain'} />
          <Text style={styles.titleStyle}>Cinemate</Text>
          <Text style={styles.subTitleStyle}>
            Find, watch and reserve movies that bring your mood back
          </Text>

        <Button
          title={CHECK_STORAGE ? 'Login' : 'Get Started'}
          style={styles.buttonWrapper}
          onPress={showSheet}
        />

      </ImageBackground>
      {registerSheetVisible &&
        <Register
          visible={registerSheetVisible}
          onDismiss={() => setRegisterSheetVisible(false)}
          onPress={handleRegister}
          onChangeText={onChangeTagName}
          value={tagName}
          isLoading={isLoading}
          disabledPanSwipe={isLoading}
          validInput={tagName.length > 0}
        />
      }

      <Login
        visible={loginSheetVisible}
        onDismiss={() => setLoginSheetVisible(false)}
        onPress={handleLogin}
        isLoading={isLoading}
        disabledPanSwipe={isLoading}
        data={allUserTagStorage}
        tagNameSelected={tagNameSelected.bind(this)}
        selectedTagName={SELECT_ACTIVE_TAG_NAME}
      />

      <ErrorWrapper
        backgroundColor={ERROR}
        errorMessage={errorMessage}
        visible={openErrorWrapper}
        onDismiss={() => setOpenErrorWrapper(false)}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackgroundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoStyle: {
    height: 80,
    width: 80,
    marginBottom: 20,
  },
  titleStyle: {
    color: WHITE,
    fontFamily: 'CircularBold',
    fontSize: sizes.h1,
    textAlign: 'center',
    paddingBottom: 15,
  },
  subTitleStyle: {
    color: WHITE,
    fontFamily: 'CircularMedium',
    fontSize: sizes.title,
    textAlign: 'center',
    paddingBottom: 20,
    paddingHorizontal: 50,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 20,
  },
  registerButtonStyle: {
    borderRadius: 20,
    backgroundColor: BUTTONCOLOR,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 35,
    right: 20,
  },
  registerTextStyle: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    fontFamily: 'CircularMedium',
    color: WHITE,
    fontSize: 16,
  },
});

const mapDispatchToProps = (dispatch) => ({
  getTagName: tagName => {
    dispatch(getTagName(tagName));
  },
  getTagStorage: tagStorage => {
    dispatch(getTagStorage(tagStorage));
  },
  getAllUserTagStorage: allUserTagStorage => {
    dispatch(getAllUserTagStorage(allUserTagStorage));
  },
  getBlackList: blackList => {
    dispatch(getBlackList(blackList));
  },
  getAuthStatus: signedIn => {
    dispatch(getAuthStatus(signedIn));
  },
  getProfileImage: profileImage => {
    dispatch(getProfileImage(profileImage));
  },
  getFavouriteMovies: favouriteMovies => {
    dispatch(getFavouriteMovies(favouriteMovies));
  },
  getReservations: reservations => {
    dispatch(getReservations(reservations));
  },
});

const mapStateToProps = (state) => ({
  allUserTagStorage: state.UserReducer.allUserTagStorage,
});

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
