
import React, { useState, useRef, useEffect, } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { connect } from 'react-redux';
import Carousel from 'react-native-anchor-carousel';
import { Ionicons, } from '@expo/vector-icons';
import Search from './Search';
import { colors, } from '../../constants/theme';
import {
  Layout,
  CategoryButton,
  Pagination,
  ErrorWrapper,
} from '../../components/Common';

const {
  WHITE,
  TEXT_GREY,
  PRIMARY,
  SECONDARY,
  GOLD,
  SUCCESS,
} = colors;


const MovieCategory = [
  {
    title: 'Romance',
    emoji: '😍',
  },
  {
    title: 'Comedy',
    emoji: '😁',
  },
  {
    title: 'Horror',
    emoji: '😱',
  },
  {
    title: 'Drama',
    emoji: '😚',
  },
];
const { width, } = Dimensions.get('window');

const MAX_SLIDER_LENGHT = 5;

function MainScreen({ tagName, favouriteMovies, profileImage, navigation, }) {
  const carouselRef = useRef(null);
  const [gallery, setGallery] = useState(favouriteMovies);
  const [activeSlide, setActiveSlide] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [openErrorWrapper, setOpenErrorWrapper] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
    const checkEmptyFavourite = favouriteMovies.filter(e => e.empty !== true);
    setGallery(checkEmptyFavourite);
  }, [favouriteMovies]);


  const slidedGallery = gallery.slice(0, MAX_SLIDER_LENGHT);

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  const handleCategory = () => {
    setOpenErrorWrapper(true);
    setErrorMessage('Coming soon!');
    // navigation.navigate('Category');
  };

  const handleViewAll = () => {
    navigation.navigate('ListDetails', { dataTitle: 'Favourites' });
  };

  const handleSearch = () => {
    setModalVisible(true);
  };

  const handleCategoryDetail = (item) => {
    setOpenErrorWrapper(true);
    setErrorMessage(`${item.title} category is coming soon!`);
  };

  const handleSelection = (item) => {
    setModalVisible(false);
    navigation.navigate('Details', { movieDetails: item });
  };

  const onScrollEndHandler = (index) => {
    setActiveSlide(index);
  };


  const renderItem = ({ item, index }) => {
    return (
      <View>
        <TouchableOpacity key={index} onPress={handleSelection.bind(this, (item))}>
          <Image source={{ uri: item.Poster }} style={styles.carouselImage} />
          <Text style={styles.carouselText}>{item.Title}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const emptyList = (
    <View style={styles.emptyListWrapper}>
      <Text style={styles.emptyListTextStyle}>
        You currently have no favourite movie or show
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
      <View style={styles.contentWrapper}>
        <View style={styles.headerWrapper}>
          <View style={styles.welcomeWrapper}>
            <Text style={styles.headerTextStyle}>Welcome {tagName} 👋🏽</Text>
            <Text style={styles.headerSubTitleStyle}>
              {"Let's relax and watch a movie!"}
            </Text>
          </View>
          <TouchableOpacity style={styles.imageWrapper} onPress={handleProfile}>
            <Ionicons
              name='ios-person'
              color={TEXT_GREY}
              size={45}
              style={styles.profileIconStyle}
            />
            {profileImage &&
              <Image
                source={profileImage ? { uri: profileImage } : null}
                style={styles.imageStyle}
              />
            }
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.searchWrapper} onPress={handleSearch}>
          <Ionicons name='ios-search' color={TEXT_GREY} size={22} />
          <Text style={styles.searchTextStyle}>
            Movies and Shows
          </Text>
        </TouchableOpacity>

        <View style={styles.categoryUpperWrapper}>
          <Text style={styles.categoryTitleStyle}>
            Category
          </Text>

          <TouchableOpacity style={styles.categoryButtonWrapper} onPress={handleCategory}>
            <Text style={styles.categoryButtonTextStyle}>
              See All
            </Text>
            <Ionicons
              name={'chevron-forward-outline'}
              color={GOLD}
              size={22}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.categoryLowerWrapper}>
          {MovieCategory.map((item) => (
            <CategoryButton
              key={item.title}
              title={item.title}
              emoji={item.emoji}
              onPress={handleCategoryDetail.bind(this, item)}
            />
          ))}
        </View>

        <View style={styles.flatlistWrapper}>
          <View style={styles.categoryUpperWrapper}>
            <Text style={styles.favouriteTitleStyle}>
              Favourite Movies & Shows
            </Text>

            {favouriteMovies.length > 5 &&
              <TouchableOpacity
                style={styles.categoryButtonWrapper}
                onPress={handleViewAll}
              >
                <Text style={styles.categoryButtonTextStyle}>
                  See All
                </Text>
                <Ionicons
                  name={'chevron-forward-outline'}
                  color={GOLD}
                  size={22}
                />
              </TouchableOpacity>
            }
          </View>


          {slidedGallery.length < 1 ?
            (emptyList)
            :
            <View style={styles.carouselContainerView}>
              <Carousel
                style={styles.carousel}
                data={slidedGallery}
                renderItem={renderItem}
                onScrollEnd={(item, index) => onScrollEndHandler(index)}
                itemWidth={200}
                containerWidth={width - 20}
                separatorWidth={0}
                ref={carouselRef}
                inActiveOpacity={0.4}
                separatorWidth={20}
                pagingEnable={false}
                //minScrollDistance={20}
              />

            <View style={styles.paginationWrapper}>
              {slidedGallery.map((item, index) => (
                <Pagination key={index} activeSlide={activeSlide === (index)} />
              ))}
            </View>
            </View>
          }
        </View>
      </View>

      <Modal
        animationType='slide'
        visible={modalVisible}
        transparent
        style={styles.modalStyle}
      >
        <Search
          onPressClose={() => setModalVisible(false)}
          onSelect={handleSelection}
        />
      </Modal>

      <ErrorWrapper
        backgroundColor={SUCCESS}
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
    paddingTop: 50,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeWrapper: {
    flex: 1,
    paddingRight: 10,
  },
  headerTextStyle: {
    fontFamily: 'CircularMedium',
    fontSize: 17,
    color: TEXT_GREY,
    paddingBottom: 5,
    textTransform: 'capitalize',
  },
  headerSubTitleStyle: {
    fontFamily: 'CircularMedium',
    fontSize: 18,
    color: WHITE,
  },
  imageWrapper: {
    width: 55,
    height: 55,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: TEXT_GREY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    borderRadius: 14,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  profileIconStyle: {
    position: 'absolute',
    bottom: -5,
    alignSelf: 'center',
  },
  searchWrapper: {
    width: '100%',
    height: 55,
    backgroundColor: SECONDARY,
    borderRadius: 15,
    marginTop: 35,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  searchTextStyle: {
    fontFamily: 'CircularMedium',
    fontSize: 15,
    color: TEXT_GREY,
    paddingLeft: 10,
  },
  categoryUpperWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryTitleStyle: {
    fontFamily: 'CircularMedium',
    fontSize: 15,
    color: WHITE,
    paddingVertical: 10,
  },
  categoryButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryButtonTextStyle: {
    fontFamily: 'CircularMedium',
    fontSize: 15,
    color: GOLD,
    paddingVertical: 10,
    paddingRight: 5,
  },
  categoryLowerWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  favouriteTitleStyle: {
    paddingTop: 20,
    paddingBottom: 10,
    fontFamily: 'CircularMedium',
    fontSize: 15,
    color: WHITE,
  },
  flatlistWrapper: {
    flex: 1,
    width: '100%',
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

  //Carousel
  carouselContainerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carousel: {
    flex: 1,
    overflow: 'visible',
  },
  carouselImage: {
    width: 200,
    height: '85%',
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  carouselText: {
    color: WHITE,
    fontFamily: 'CircularBold',
    paddingTop: 10,
  },
  paginationWrapper: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalStyle: {
    ...StyleSheet.absoluteFillObject,
  },
});

const mapStateToProps = (state) => ({
  tagName: state.UserReducer.tagName,
  favouriteMovies: state.UserReducer.favouriteMovies,
  profileImage: state.UserReducer.profileImage,
  tagStorage: state.UserReducer.tagStorage,
});

export default connect(mapStateToProps)(MainScreen);
