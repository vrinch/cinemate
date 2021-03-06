
import React, { useEffect, useCallback, useState, } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import _ from 'lodash';
// import * as lodash from 'lodash';
import { connect } from 'react-redux';
import { Ionicons, } from '@expo/vector-icons';
import { colors, } from '../../constants/theme';
import {
  Layout,
  Header,
} from '../../components/Common';

const {
  TEXT_BLACK,
  WHITE,
  TEXT_GREY,
  BUTTONCOLOR,
  PRIMARY,
  SECONDARY,
  TERTIARY,
  ORANGE,
} = colors;

const SEARCH_CATEGORY = [
  {
    title: 'Movies',
    content: 'movie',
  },
  {
    title: 'Shows',
    content: 'series',
  },
];

// 56a45716
const API_KEY = '71e2871c';
const NUMBER_OF_PAGES = 1;
function Search({ onPressClose, onSelect, blackList, ...props }) {
  const [borderColor, setBorderColor] = useState(TERTIARY);
  const [searchType, setSearchType] = useState('movie');
  const [itemList, setItemList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const debounceLoadData = useCallback(_.debounce(onSearch.bind(this), 500), []);

  async function onSearch(value) {
    try {
      // setItemList([]);
      const apiUrl = `http://www.omdbapi.com/?apikey=${API_KEY}&type=${searchType}&t=${value}&page=${NUMBER_OF_PAGES}`;
      const result = await fetch(apiUrl);
      const json = await result.json();

      if (value && json.Response === 'False') {
        setErrorMessage(json.Error);
      } else if (json.Response === 'True') {
        const { Poster, Title, imdbVotes, Plot, Director, Writer, Actors, Genre,
                Year, Runtime, Released, imdbID, imdbRating, } = json;

        const checkBlackList = blackList.filter(e => e.imdbID === imdbID).length < 1;

        const movieDetails = {
          Poster,
          Title,
          imdbVotes,
          Plot,
          Director,
          Writer,
          Actors,
          Genre,
          Year,
          Runtime,
          Released,
          imdbID,
          imdbRating,
        };


        if (checkBlackList) {
          const searchList = [...itemList, movieDetails];
          const filterList = _.uniqBy(searchList, 'imdbID');
          setItemList(filterList);
        } else {
          setErrorMessage(`This ${searchType} is currently in your blacklist`);
        }
      }
    } catch (e) {
      setErrorMessage('An search error occurred, please try again');
      console.warn(e);
    }
  };

  const onChangeSearch = (value) => {
    setSearchValue(value);
    setErrorMessage('');
    debounceLoadData(value);
  };

  const handleReset = () => {
    setSearchValue('');
    setItemList([]);
    setErrorMessage('');
  };

  const onFocus = () => {
    setBorderColor(BUTTONCOLOR);
  };

  const onBlur = () => {
    setBorderColor(TERTIARY);
  };

  const handleSearchType = (item) => {
    setSearchType(item.content);
    setSearchValue('');
    setItemList([]);
    setErrorMessage('');
  };

  const handleSelection = (item) => {
    onSelect(item);
  };

  const emptyList = (
    <View style={styles.emptyListWrapper}>
      <Text style={styles.emptyListTextStyle}>
        {errorMessage}
      </Text>
    </View>
  );

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.listContainer} onPress={handleSelection.bind(this, item)}>
        <Image source={{ uri: item.Poster }} style={styles.imageStyle} />
        <View style={styles.listTextWrapper}>
          <Text style={styles.ratingStyle}>
            {item.imdbRating}{' '}
            <Ionicons name={'star'} color={ORANGE} size={14} />
          </Text>
          <Text style={styles.listTitleStyle}>{item.Title}</Text>
          <Text style={styles.listDescStyle} numberOfLines={3}>{item.Plot}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Layout
      style={styles.container}
      colors={[PRIMARY, SECONDARY]}
      start={[0, 1]}
      end={[1, 0]}
    >
      <Header
        onPressBack={onPressClose}
        title={'Search Movies & Shows'}
        iconName={'close'}
      />
      <View style={styles.contentWrapper}>
        <View style={styles.buttonWrapper}>
          {SEARCH_CATEGORY.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={handleSearchType.bind(this, item)}
              style={item.content === searchType ? styles.activeButton : styles.inactiveButton}
            >
              <Text
                style={item.content === searchType ? styles.activeText : styles.inactiveText}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={[{ borderColor, }, styles.searchWrapper]}>
          <Ionicons name='ios-search' color={TEXT_GREY} size={22} />
          <TextInput
            placeholderTextColor={TEXT_GREY}
            style={styles.inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
            autoCorrect={false}
            placeholder={'Movies & Shows'}
            underlineColorAndroid="transparent"
            returnKeyType='done'
            autoFocus
            onChangeText={onChangeSearch}
            value={searchValue}
            keyboardType='visible-password'
            autoCapitalize='none'
            // enablesReturnKeyAutomatically
            {...props}
          />
        {searchValue !== '' &&
          <TouchableOpacity
            style={styles.clearInputStyle}
            onPress={handleReset}
          >
            <Ionicons name='close' color={TEXT_GREY} size={15} />
          </TouchableOpacity>
        }
        </View>

        {errorMessage !== '' && itemList.length < 1 &&
          (emptyList)
        }
        {searchValue !== '' && itemList.length > 0 &&
          <View style={[{ borderColor, }, styles.flatlistWrapper]}>
            <FlatList
              data={itemList}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              extraData={itemList}
              style={{ paddingHorizontal: 10 }}
              keyboardShouldPersistTaps={'handled'}
            />
          </View>
        }

      </View>

    </Layout>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchWrapper: {
    width: '100%',
    height: 55,
    backgroundColor: SECONDARY,
    borderRadius: 15,
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    paddingLeft: 20,
    borderWidth: 2,
    zIndex: 100,
  },
  inputStyle: {
    fontFamily: 'CircularMedium',
    fontSize: 15,
    color: TEXT_GREY,
    paddingLeft: 10,
    // width: '100%',
    height: '100%',
    flex: 1,
  },
  buttonWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  activeButton: {
    width: '48%',
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  inactiveButton: {
    width: '48%',
    backgroundColor: SECONDARY,
    borderWidth: 1,
    borderColor: TERTIARY,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  activeText: {
    paddingVertical: 20,
    fontFamily: 'CircularMedium',
    color: TEXT_BLACK,
    fontSize: 16,
  },
  inactiveText: {
    paddingVertical: 20,
    fontFamily: 'CircularMedium',
    color: WHITE,
    fontSize: 16,
  },
  flatlistWrapper: {
    width: '100%',
    borderWidth: 2,
    top: -15,
    paddingTop: 30,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    maxHeight: 350,
  },
  listContainer: {
    width: '100%',
    backgroundColor: SECONDARY,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginVertical: 15,
    marginRight: 10,
  },
  listTextWrapper: {
    flex: 1,
  },
  listTitleStyle: {
    color: WHITE,
    paddingBottom: 5,
    fontFamily: 'CircularBold',
    fontSize: 14,
  },
  listDescStyle: {
    color: TEXT_GREY,
    paddingBottom: 5,
    fontFamily: 'CircularRegular',
    fontSize: 14,
  },
  ratingStyle: {
    color: WHITE,
    paddingBottom: 5,
    fontFamily: 'CircularBold',
    fontSize: 14,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  clearInputStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: PRIMARY,
  },
  emptyListWrapper: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListTextStyle: {
    paddingTop: 50,
    fontFamily: 'CircularMedium',
    fontSize: 15,
    color: TEXT_GREY,
    textAlign: 'center',
  },
});

const mapStateToProps = (state) => ({
  blackList: state.UserReducer.blackList,
});

export default connect(mapStateToProps)(Search);
