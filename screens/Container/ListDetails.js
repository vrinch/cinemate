import React, { useEffect, useState, } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { connect } from 'react-redux';
import { colors, } from '../../constants/theme';
import {
  Layout,
  Header,
} from '../../components/Common';

const {
  WHITE,
  TEXT_GREY,
  PRIMARY,
  SECONDARY,
} = colors;


const { width, } = Dimensions.get('window');

const numColumns = 2;

function ListDetails({ navigation, favouriteMovies, blackList, reservations,
  route: { params: { dataTitle, } }, }) {
  const [newFavouriteLIst, setFavouriteList] = useState(favouriteMovies);
  const [newBlackList, setBlackList] = useState(blackList);
  const [newReservationLIst, setReservationList] = useState(reservations);

  useEffect(() => {
    setFavouriteList(favouriteMovies);
    setBlackList(blackList);
    setReservationList(reservations);
  }, [favouriteMovies, blackList, reservations]);

  const handleBack = () => {
    navigation.goBack();
  };


  const handleSelection = (item) => {
    navigation.navigate('Details', { movieDetails: item, });
  };

  const getListType = () => {
    if (dataTitle === 'Favourites') {
      return newFavouriteLIst;
    } else if (dataTitle === 'Blacklists') {
      return newBlackList;
    } else if (dataTitle === 'Reservations') {
      return newReservationLIst;
    }
      return [];
  };
  const dataList = getListType();

  const formatData = () => {
    if (dataList.length > 0) {
      const numberOfFullRows = Math.floor(dataList.length / numColumns);
      let numberOfElementsLastRow = dataList.length - (numberOfFullRows * numColumns);

      while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
        dataList.push({ empty: true, Poster: null, Title: '', });
        numberOfElementsLastRow = numberOfElementsLastRow + 1;
      }
        return dataList;
    }
      return [];
  };

  const renderItem = ({ item, index }) => {
    if (item.empty) {
      return (
        <View style={styles.itemWrapper} key={index}>
          <View style={styles.itemInvisible} />
        </View>
      );
    }
    return (
      <View style={styles.itemWrapper}>
        <TouchableOpacity key={index} onPress={handleSelection.bind(this, (item))}>
          <Image source={{ uri: item.Poster }} style={styles.itemImage} />
          <Text style={styles.itemText} numberOfLines={1}>{item.Title}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const emptyList = (
    <View style={styles.emptyListWrapper}>
      <Text style={styles.emptyListTextStyle}>
        {dataTitle === 'Reservations' && 'You currently have no reservations'}
        {dataTitle === 'Favourites' && 'You currently have no favourite movie or show'}
        {dataTitle === 'Blacklists' && 'You currently have no blacklisted movie or show'}
      </Text>
    </View>
  );

  return (
    <Layout
      style={styles.container}
      colors={[PRIMARY, SECONDARY]}
      start={[0, 1]}
      end={[1, 0]}
    >
      <StatusBar translucent backgroundColor='transparent' style="light" />
      <Header
        title={dataTitle}
        onPressBack={handleBack}
        iconName={'chevron-back'}
      />
      <View style={styles.contentWrapper}>
        {dataList.length < 1 ?
          (emptyList)
          :
          <FlatList
            data={formatData()}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            extraData={formatData()}
            numColumns={numColumns}
          />
        }
      </View>
    </Layout>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  contentWrapper: {
    flex: 1,
  },
  itemWrapper: {
    flex: 1,
    margin: 15,
    height: width / numColumns,
    // backgroundColor: 'red',
    borderRadius: 10,
  },
  itemImage: {
    width: '100%',
    height: '90%',
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  itemInvisible: {
    width: '100%',
    height: '90%',
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  itemText: {
    color: WHITE,
    fontFamily: 'CircularBold',
    paddingTop: 10,
  },
  emptyListWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListTextStyle: {
    paddingTop: 20,
    fontFamily: 'CircularMedium',
    fontSize: 15,
    color: TEXT_GREY,
    textAlign: 'center',
  },
});

const mapStateToProps = (state) => ({
  blackList: state.UserReducer.blackList,
  favouriteMovies: state.UserReducer.favouriteMovies,
  reservations: state.UserReducer.reservations,
  tagStorage: state.UserReducer.tagStorage,
});

export default connect(mapStateToProps)(ListDetails);
