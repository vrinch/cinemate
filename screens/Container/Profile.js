
import React, { useState, useEffect, } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { connect } from 'react-redux';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, } from '../../constants/theme';
import {
  Button,
  ErrorWrapper,
  Layout,
  UploadImage,
} from '../../components/Common';
import { SignOut, } from '../../components/Auth';
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
  TEXT_GREY,
  PRIMARY,
  SECONDARY,
  ERROR,
} = colors;


const currentDate = moment().format('MMM Do,');
const currentYear = moment().format('YYYY');
const USER_DETAILS = 'USER_DETAILS';

function Profile({ tagName, profileImage, navigation, tagStorage: { timeCreated },
  getTagName, getTagStorage, getBlackList, getAuthStatus, getProfileImage,
  getFavouriteMovies, getReservations, getAllUserTagStorage, }) {
  const [imageSheetVisible, setImageSheetVisible] = useState(false);
  const [authSheetVisible, setAuthSheetVisible] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSignout, setIsLoadingSignout] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [openErrorWrapper, setOpenErrorWrapper] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const createdDate = moment(timeCreated).format('MMM Do,');
  const createdTime = moment(timeCreated).format('hh:mm A');
  const createdYear = moment(timeCreated).format('YYYY');
  const createdYearString = currentYear === createdYear;
  const dateString = moment(timeCreated).format(`MMM Do, ${createdYearString ? ''
  : 'YYYY,'} hh:mm A`);
  const createdString = currentDate === createdDate ? `Today, ${createdTime}` : `on ${dateString}`;

  useEffect(async () => {
    try {
      const storedData = await AsyncStorage.getItem(USER_DETAILS);
      const parsedData = JSON.parse(storedData);
      setUserDetails(parsedData || []);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const saveUserDetail = async (userData) => {
    await AsyncStorage.setItem(USER_DETAILS, JSON.stringify(userData));
  };

  const handleFavouriteList = () => {
    navigation.navigate('ListDetails', { dataTitle: 'Favourites' });
  };

  const handleBlackList = () => {
    navigation.navigate('ListDetails', { dataTitle: 'Blacklists' });
  };

  const handleReservations = () => {
    navigation.navigate('ListDetails', { dataTitle: 'Reservations' });
  };

  const handleAuthSheet = () => {
    setAuthSheetVisible(true);
  };

  const handleImageSheet = () => {
    setImageSheetVisible(true);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setOpenErrorWrapper(true);
        setErrorMessage('Enable camera permissions for the app to make this work');
        return;
      }
        const photo = await ImagePicker.launchCameraAsync({
          presentationStyle: 0,
          exif: true,
          allowsEditing: true,
          quality: 0.7,
          base64: true,
        });
        setImageSheetVisible(false);

        if (!photo.cancelled) {
          getProfileImage(photo.uri);
          const userIndex = userDetails.findIndex(e => e.tagName === tagName);
          userDetails[userIndex].profileImage = photo.uri;

          setUserDetails(userDetails);
          saveUserDetail(userDetails);
          getAllUserTagStorage(userDetails);
        }
    } catch (e) {
      setOpenErrorWrapper(true);
      setErrorMessage('Enable camera permissions for the app to make this work');
    }
  };

  const handlePickPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setOpenErrorWrapper(true);
        setErrorMessage('Enable camera roll permissions for the app to make this work');
        return;
      }
        const photo = await ImagePicker.launchImageLibraryAsync({
          presentationStyle: 0,
          mediaTypes: ImagePicker.MediaTypeOptions.image,
          allowsEditing: true,
          quality: 0.7,
          exif: true,
          base64: true,
        });
        setImageSheetVisible(false);

        if (!photo.cancelled) {
          getProfileImage(photo.uri);
          const userIndex = userDetails.findIndex(e => e.tagName === tagName);
          userDetails[userIndex].profileImage = photo.uri;

          setUserDetails(userDetails);
          saveUserDetail(userDetails);
          getAllUserTagStorage(userDetails);
        }
    } catch (e) {
      setOpenErrorWrapper(true);
      setErrorMessage('Enable camera roll permissions for the app to make this work');
    }
  };

  const handleSignOut = () => {
    const userIndex = userDetails.findIndex(e => e.tagName === tagName);
    userDetails[userIndex].signedIn = false;

    setIsLoading(true);
    setIsLoadingSignout(true);
    setUserDetails(userDetails);
    saveUserDetail(userDetails);

    setTimeout(() => {
      setIsLoading(false);
      getAllUserTagStorage(userDetails);
      getTagName('');
      getTagStorage({});
      getBlackList([]);
      getAuthStatus(true);
      getProfileImage(null);
      getFavouriteMovies([]);
      getReservations([]);
      navigation.navigate('Welcome');
    }, 2000);
  };

  const handleDelete = () => {
    const filteredTags = userDetails.filter(e => e.tagName !== tagName);

    setIsLoading(true);
    setIsLoadingDelete(true);
    saveUserDetail(filteredTags);
    setTimeout(() => {
      setIsLoading(false);
      getAllUserTagStorage(filteredTags);
      getTagName('');
      getTagStorage({});
      getBlackList([]);
      getAuthStatus(true);
      getProfileImage(null);
      getFavouriteMovies([]);
      getReservations([]);
      navigation.navigate('Welcome');
    }, 2000);
  };

  return (
    <Layout
      style={styles.container}
      colors={[PRIMARY, SECONDARY]}
      start={[0, 1]}
      end={[1, 0]}
    >
      <StatusBar translucent backgroundColor='transparent' style="light" />
      <View style={styles.contentWrapper}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity
            style={styles.backButton}
            disabled={isLoading}
            onPress={handleBack}
          >
            <Ionicons color={TEXT_GREY} size={30} name='chevron-back' />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.imageWrapper}
            disabled={isLoading || authSheetVisible}
            onPress={handleImageSheet}
          >
            <Ionicons
              name='ios-person'
              color={TEXT_GREY}
              size={80}
              style={styles.profileIconStyle}
            />
            {profileImage &&
              <Image
                source={profileImage ? { uri: profileImage } : null}
                style={styles.imageStyle}
              />
            }
          </TouchableOpacity>
          <Text style={styles.headerTextStyle}>@{tagName}</Text>
          <Text style={styles.headerSubTitleStyle}>
            Created {createdString}
          </Text>
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            showRight
            title={'Favourite List'}
            style={{ marginTop: 10, }}
            onPress={handleFavouriteList}
            disabled={isLoading}
            buttonColor={SECONDARY}
          />
          <Button
            showRight
            title={'Black List'}
            style={{ marginTop: 10, }}
            onPress={handleBlackList}
            disabled={isLoading}
            buttonColor={SECONDARY}
          />
          <Button
            showRight
            title={'Reservations'}
            style={{ marginTop: 10, }}
            onPress={handleReservations}
            disabled={isLoading}
            buttonColor={SECONDARY}
          />
          <Button
            showRight
            title={'Sign Out'}
            iconType='power'
            style={{ marginTop: 10, }}
            buttonColor={ERROR}
            disabled={isLoading || imageSheetVisible}
            onPress={handleAuthSheet}
          />
        </View>

        <UploadImage
          visible={imageSheetVisible}
          onDismiss={() => setImageSheetVisible(false)}
          onPressPick={handlePickPhoto}
          onPresTake={handleTakePhoto}
          disabledPanSwipe={isLoading}
          disabled={isLoading}
        />

        <SignOut
          visible={authSheetVisible}
          onDismiss={() => setAuthSheetVisible(false)}
          onPressSignOut={handleSignOut}
          onPressDelete={handleDelete}
          isLoadingSignout={isLoadingSignout}
          isLoadingDelete={isLoadingDelete}
          disabledPanSwipe={isLoading}
          disabled={isLoading}
        />
      </View>
      <ErrorWrapper
        backgroundColor={ERROR}
        errorMessage={errorMessage}
        visible={openErrorWrapper}
        onDismiss={() => setOpenErrorWrapper(false)}
      />
    </Layout>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    paddingTop: 50,
  },
  contentWrapper: {
    flex: 1,
  },
  headerWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextStyle: {
    fontFamily: 'CircularMedium',
    fontSize: 25,
    paddingVertical: 20,
    paddingBottom: 5,
    textTransform: 'capitalize',
    color: WHITE,
  },
  headerSubTitleStyle: {
    fontFamily: 'CircularMedium',
    color: TEXT_GREY,
    fontSize: 18,
  },
  imageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: TEXT_GREY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    borderRadius: 35,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  profileIconStyle: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    opacity: 0.5,
  },
});

const mapStateToProps = (state) => ({
  tagName: state.UserReducer.tagName,
  tagStorage: state.UserReducer.tagStorage,
  profileImage: state.UserReducer.profileImage,
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
