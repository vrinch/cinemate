
import React, { useState, useEffect, } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { connect } from 'react-redux';
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, } from '../../constants/theme';
import {
  Button,
  ErrorWrapper,
  Layout,
  Header,
} from '../../components/Common';
import {
  getTagStorage,
  getAllUserTagStorage,
  getFavouriteMovies,
  getReservations,
  getBlackList,
} from '../../src/actions';

const {
  TEXT_BLACK,
  WHITE,
  TEXT_GREY,
  PRIMARY,
  SECONDARY,
  ERROR,
  ORANGE,
  SUCCESS,
} = colors;

const ListWrap = ({ title, color, content, }) => (
  <View style={styles.listWrapper}>
    <Text style={[{ color }, styles.listTitleStyle]}>{title}</Text>
    <Text style={styles.listContentStyle}>{content}</Text>
  </View>
);

const USER_DETAILS = 'USER_DETAILS';

function Details({ route, navigation, getTagStorage, getAllUserTagStorage,
  getFavouriteMovies, getReservations, getBlackList, allUserTagStorage, tagStorage,
  favouriteMovies, reservations, blackList, }) {
  const { params: { movieDetails: { Poster, Title, imdbVotes, Plot, Director, Writer,
    Actors, Genre, Year, Runtime, Released, imdbID, }, movieDetails, } } = route;
  const [openErrorWrapper, setOpenErrorWrapper] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userDetails, setUserDetails] = useState([]);


  useEffect(async () => {
    try {
      const storedData = await AsyncStorage.getItem(USER_DETAILS);
      const parsedData = JSON.parse(storedData);
      setUserDetails(parsedData || []);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const checkEmptyReservation = reservations.filter(e => e.empty !== true);
  const checkEmptyFavourite = favouriteMovies.filter(e => e.empty !== true);
  const checkEmptyBlackList = blackList.filter(e => e.empty !== true);

  const checkReservation = checkEmptyReservation.filter(e => e.imdbID === imdbID).length < 1;
  const checkFavourite = checkEmptyFavourite.filter(e => e.imdbID === imdbID).length < 1;
  const checkBlackList = checkEmptyBlackList.filter(e => e.imdbID === imdbID).length < 1;

  const handleBack = () => {
    navigation.goBack();
  };

  const handlePlay = () => {
    setOpenErrorWrapper(true);
    setErrorMessage('We are currently working on this feature!');
  };

  const handleReservations = () => {
    const filteredReservation = checkEmptyReservation.filter(e => e.imdbID !== imdbID);
    const findTagIndex = allUserTagStorage.findIndex((e) => e.tagName === tagStorage.tagName);

    if (checkReservation) {
      const data = [...checkEmptyReservation, movieDetails];
      getReservations(data);

      tagStorage.reservations = data;
      allUserTagStorage[findTagIndex] = tagStorage;


      getAllUserTagStorage(allUserTagStorage);
      getTagStorage(tagStorage);

      saveUserDetail(allUserTagStorage);
      setOpenErrorWrapper(true);
      setErrorMessage('Your reservation was successful');
    } else {
      getReservations(filteredReservation);

      tagStorage.reservations = filteredReservation;
      allUserTagStorage[findTagIndex] = tagStorage;

      getAllUserTagStorage(allUserTagStorage);
      getTagStorage(tagStorage);

      saveUserDetail(allUserTagStorage);
      setOpenErrorWrapper(true);
      setErrorMessage('Your reservation has been successfully cancelled');
    }
  };

  const handleFavouriteList = () => {
    const filteredFavourite = checkEmptyFavourite.filter(e => e.imdbID !== imdbID);
    const findTagIndex = allUserTagStorage.findIndex((e) => e.tagName === tagStorage.tagName);

    if (checkFavourite) {
      const data = [...checkEmptyFavourite, movieDetails];
      getFavouriteMovies(data);

      tagStorage.favouriteMovies = data;
      allUserTagStorage[findTagIndex] = tagStorage;

      getAllUserTagStorage(allUserTagStorage);
      getTagStorage(tagStorage);

      saveUserDetail(allUserTagStorage);
      setOpenErrorWrapper(true);
      setErrorMessage(`${Title} has successfully been added to your favourite list`);
    } else {
      getFavouriteMovies(filteredFavourite);

      tagStorage.favouriteMovies = filteredFavourite;
      allUserTagStorage[findTagIndex] = tagStorage;


      getAllUserTagStorage(allUserTagStorage);
      getTagStorage(tagStorage);

      saveUserDetail(allUserTagStorage);
      setOpenErrorWrapper(true);
      setErrorMessage(`${Title} has successfully been removed from your favourite list`);
    }
  };


  const handleBlackList = () => {
    const filteredBlackList = checkEmptyBlackList.filter(e => e.imdbID !== imdbID);
    const findTagIndex = allUserTagStorage.findIndex((e) => e.tagName === tagStorage.tagName);

    if (checkBlackList) {
      const data = [...checkEmptyBlackList, movieDetails];
      getBlackList(data);

      tagStorage.blackList = data;
      allUserTagStorage[findTagIndex] = tagStorage;

      getAllUserTagStorage(allUserTagStorage);
      getTagStorage(tagStorage);

      saveUserDetail(allUserTagStorage);
      setOpenErrorWrapper(true);
      setErrorMessage(`${Title} has successfully been added to your blacklist`);
    } else {
      getBlackList(filteredBlackList);

      tagStorage.blackList = filteredBlackList;
      allUserTagStorage[findTagIndex] = tagStorage;


      getAllUserTagStorage(allUserTagStorage);
      getTagStorage(tagStorage);

      saveUserDetail(allUserTagStorage);
      setOpenErrorWrapper(true);
      setErrorMessage(`${Title} has successfully been removed from your blacklist`);
    }
  };

  const saveUserDetail = async (userData) => {
    await AsyncStorage.setItem(USER_DETAILS, JSON.stringify(userData));
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor='transparent' style="light" />
      <ImageBackground
        style={styles.imageBackgroundContainer}
        source={{ uri: Poster }}
        resizeMode={'cover'}
      >
      <Layout
        style={styles.layoutContainer}
        colors={['rgba(0, 0, 0, 0.5)', TEXT_BLACK]}
        start={[0.5, 0]}
        end={[0, 2]}
      >
        <Header onPressBack={handleBack} iconName={'chevron-back'} />
        <Text style={styles.titleStyle}>{Title}</Text>

        {checkBlackList &&
          <TouchableOpacity
            style={styles.favouriteButton}
            onPress={handleFavouriteList}
          >
            <Ionicons
              name={checkFavourite ? 'star-outline' : 'star'}
              color={checkFavourite ? WHITE : ORANGE}
              size={25}
            />
          </TouchableOpacity>
        }

        {checkFavourite && checkReservation &&
          <TouchableOpacity
            style={styles.blackListButton}
            onPress={handleBlackList}
          >
            <MaterialCommunityIcons
              name={'cancel'}
              color={checkBlackList ? WHITE : ERROR}
              size={25}
            />
          </TouchableOpacity>
        }
      </Layout>

      </ImageBackground>

      <View style={styles.contentWrapper}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={handlePlay}
        >
          <Ionicons name={'play'} color={WHITE} size={30} />
        </TouchableOpacity>

        <Layout
          style={styles.container}
          colors={[PRIMARY, SECONDARY]}
          start={[0, 1]}
          end={[1, 0]}
        >
          <View style={styles.container}>
            <ScrollView
               showsVerticalScrollIndicator={false}
               style={styles.scrollableList}
            >
              <View style={styles.listWrapper}>
                <Text style={[{ color: TEXT_GREY, }, styles.listTitleStyle]}>
                  {imdbVotes}
                </Text>
                <Ionicons name='star' color={ORANGE} size={14} style={{ paddingRight: 7, }} />
                <Ionicons name='star' color={ORANGE} size={14} style={{ paddingRight: 7, }} />
                <Ionicons name='star' color={ORANGE} size={14} style={{ paddingRight: 7, }} />
                <Ionicons name='star' color={ORANGE} size={14} style={{ paddingRight: 7, }} />
                <Ionicons name='star' color={ORANGE} size={14} style={{ paddingRight: 7, }} />
              </View>
              <ListWrap title={'Year:'} content={Year} color={TEXT_GREY} />
              <ListWrap title={'Runtime:'} content={Runtime} color={TEXT_GREY} />
              <ListWrap title={'Released:'} content={Released} color={TEXT_GREY} />

              <Text style={styles.plotTitleStyle}>The Plot</Text>
              <Text style={styles.plotContentStyle}>{Plot}</Text>

              <ListWrap title={'Director:'} content={Director} color={ORANGE} />
              <ListWrap title={'Writer:'} content={Writer} color={ORANGE} />
              <ListWrap title={'Director:'} content={Director} color={ORANGE} />
              <ListWrap title={'Genre:'} content={Genre} color={ORANGE} />
              <ListWrap title={'Actors:'} content={Actors} color={ORANGE} />
            </ScrollView>

            {checkBlackList &&
              <Button
                buttonColor={ORANGE}
                title={checkReservation ? 'Get Reservation' : 'Cancel Reservation'}
                style={{ marginBottom: 10 }}
                onPress={handleReservations}
              />
            }

          </View>
        </Layout>

      </View>

      <ErrorWrapper
        backgroundColor={SUCCESS}
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
    flex: 0.48,
  },
  layoutContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: 35,
  },
  titleStyle: {
    paddingHorizontal: 20,
    fontFamily: 'CircularBold',
    fontSize: 25,
    color: WHITE,
    paddingBottom: 40,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -25,
    left: 20,
    zIndex: 1000,
  },

  favouriteButton: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 20,
    zIndex: 1000,
  },

  blackListButton: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1000,
  },

  contentWrapper: {
    flex: 0.52,
    backgroundColor: TEXT_BLACK,
  },
  scrollableList: {
    width: '100%',
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  listWrapper: {
    flexDirection: 'row',
    // alignItems: 'center',
    paddingBottom: 20,
  },
  listTitleStyle: {
    fontSize: 15,
    fontFamily: 'CircularMedium',
    paddingRight: 10,
  },
  listContentStyle: {
    fontSize: 15,
    fontFamily: 'CircularMedium',
    color: WHITE,
    flex: 1,
  },

  plotTitleStyle: {
    fontSize: 17,
    fontFamily: 'CircularMedium',
    paddingBottom: 10,
    color: WHITE,
  },
  plotContentStyle: {
    fontSize: 15,
    fontFamily: 'CircularMedium',
    color: TEXT_GREY,
    paddingBottom: 20,
  },
});

const mapStateToProps = (state) => ({
  favouriteMovies: state.UserReducer.favouriteMovies,
  reservations: state.UserReducer.reservations,
  blackList: state.UserReducer.blackList,
  allUserTagStorage: state.UserReducer.allUserTagStorage,
  tagStorage: state.UserReducer.tagStorage,
});

const mapDispatchToProps = (dispatch) => ({
  getTagStorage: tagStorage => {
    dispatch(getTagStorage(tagStorage));
  },
  getAllUserTagStorage: allUserTagStorage => {
    dispatch(getAllUserTagStorage(allUserTagStorage));
  },
  getFavouriteMovies: favouriteMovies => {
    dispatch(getFavouriteMovies(favouriteMovies));
  },
  getReservations: reservations => {
    dispatch(getReservations(reservations));
  },
  getBlackList: blackList => {
    dispatch(getBlackList(blackList));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Details);
