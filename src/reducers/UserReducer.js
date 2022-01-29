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
} from '../actions/types';

const initialState = {
  tagName: '',
  tagStorage: {},
  allUserTagStorage: [],
  favouriteMovies: [],
  reservations: [],
  blackList: [],
  profileImage: null,
  signedIn: true,
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET_AUTH:
      return initialState;
    case TAG_NAME:
      return {
        ...state,
        tagName: action.payload,
      };
    case TAG_OBJECT_STORAGE:
      return {
        ...state,
        tagStorage: action.payload,
      };
    case TAG_AUTH_STATUS:
      return {
        ...state,
        signedIn: action.payload,
      };
    case TAG_FAVOURITE_LIST:
      return {
        ...state,
        favouriteMovies: action.payload,
      };
    case TAG_RESERVATIONS:
      return {
        ...state,
        reservations: action.payload,
      };
    case TAG_BLACKLIST:
      return {
        ...state,
        blackList: action.payload,
      };
    case PROFILE_IMAGE:
      return {
        ...state,
        profileImage: action.payload,
      };
    case ALL_USER_TAG_STORAGE:
      return {
        ...state,
        allUserTagStorage: action.payload,
      };
    default:
      return state;
  }
};

export default AuthReducer;
