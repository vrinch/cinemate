import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Welcome,
  MainScreen,
  Profile,
  ListDetails,
  Details,
} from '../screens/Container';
import {
  getTagName,
  getTagStorage,
  getBlackList,
  getAuthStatus,
  getProfileImage,
  getFavouriteMovies,
  getReservations,
  getAllUserTagStorage,
} from '../src/actions';

const USER_DETAILS = 'USER_DETAILS';
const Stack = createStackNavigator();
const screenOptions = {
  headerShown: false,
};

const gesture = {
  gestureEnabled: false,
};


function Navigation({ userDetails, getTagName, getTagStorage, getBlackList, getAuthStatus,
  getProfileImage, getFavouriteMovies, getReservations, getAllUserTagStorage, }) {
  const filterAuthStatus = userDetails.filter((e) => e.signedIn === true);
  const checkLength = filterAuthStatus.length > 0;

  getAllUserTagStorage(userDetails);
  if (checkLength) {
    getTagStorage(filterAuthStatus[0]);
    getTagName(filterAuthStatus[0].tagName);
    getBlackList(filterAuthStatus[0].blackList);
    getAuthStatus(filterAuthStatus[0].signedIn);
    getProfileImage(filterAuthStatus[0].profileImage);
    getFavouriteMovies(filterAuthStatus[0].favouriteMovies);
    getReservations(filterAuthStatus[0].reservations);
  }

  // useEffect(() => {
  //   AsyncStorage.removeItem(USER_DETAILS);
  // }, []);

  return (
    <Stack.Navigator
      initialRouteName={checkLength ? 'MainScreen' : 'Welcome'}
      screenOptions={screenOptions}
      options={screenOptions}
      name='Navigation'
    >
      <Stack.Screen name="Welcome" component={Welcome} options={gesture} />
      <Stack.Screen name="MainScreen" component={MainScreen} options={gesture} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Details" component={Details} />
      <Stack.Screen name="ListDetails" component={ListDetails} />
    </Stack.Navigator>
  );
}

const mapDispatchToProps = (dispatch) => ({
  getTagName: tagName => {
    dispatch(getTagName(tagName));
  },
  getTagStorage: tagStorage => {
    dispatch(getTagStorage(tagStorage));
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
  getAllUserTagStorage: allUserTagStorage => {
    dispatch(getAllUserTagStorage(allUserTagStorage));
  },
});

export default connect(null, mapDispatchToProps)(Navigation);
