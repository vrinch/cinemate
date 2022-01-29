import {
  TAG_NAME,
  TAG_OBJECT_STORAGE,
  TAG_AUTH_STATUS,
  TAG_FAVOURITE_LIST,
  TAG_RESERVATIONS,
  TAG_BLACKLIST,
  PROFILE_IMAGE,
  RESET_AUTH,
  ALL_USER_TAG_STORAGE,
} from './types';

export const getTagName = (tagName) => {
  return {
    type: TAG_NAME,
    payload: tagName,
  };
};

export const getTagStorage = (tagStorage) => {
  return {
    type: TAG_OBJECT_STORAGE,
    payload: tagStorage,
  };
};

export const getAuthStatus = (signedIn) => {
  return {
    type: TAG_AUTH_STATUS,
    payload: signedIn,
  };
};

export const getFavouriteMovies = (favouriteMovies) => {
  return {
    type: TAG_FAVOURITE_LIST,
    payload: favouriteMovies,
  };
};

export const getReservations = (reservations) => {
  return {
    type: TAG_RESERVATIONS,
    payload: reservations,
  };
};

export const getBlackList = (blackList) => {
  return {
    type: TAG_BLACKLIST,
    payload: blackList,
  };
};

export const getProfileImage = (profileImage) => {
  return {
    type: PROFILE_IMAGE,
    payload: profileImage,
  };
};

export const getAllUserTagStorage = (allUserTagStorage) => {
  return {
    type: ALL_USER_TAG_STORAGE,
    payload: allUserTagStorage,
  };
};

export const resetAuth = () => {
  return {
    type: RESET_AUTH,
  };
};
