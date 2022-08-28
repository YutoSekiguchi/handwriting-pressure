import { usersActions } from "../actions/usersActions";

export const initialState = {
  fetching: false,
  userAllData: [],
  userData: {},
  error: null
}

export const usersReducer = (state: any, actions: any) => {
  switch (actions.type) {
    case usersActions.CREATE_EXAM_USER:
      return {
        ...state,
        fetching: true,
      }

    case usersActions.CREATE_EXAM_USER_SUCCESS:
      return {
        ...state,
        fetching: false,
        userData: actions.payload,
        ok: true,
      }

    case usersActions.CREATE_EXAM_USER_ERROR:
      return {
        ...state,
        fetching: false,
        error: actions.payload
      }
    
    case usersActions.GET_ALL_EXAM_USERS:
      return {
        ...state,
        fetching: true
      }
    
    case usersActions.GET_ALL_EXAM_USERS_SUCCESS:
      return {
        ...state,
        fetching: false,
        userAllData: actions.payload
      }
    
    case usersActions.GET_ALL_EXAM_USERS_ERROR:
      return {
        ...state,
        fetching: false,
        error: actions.payload
      }

    case usersActions.GET_EXAM_USER:
      return {
        ...state,
        fetching: true,
      }
    
    case usersActions.GET_EXAM_USER_SUCCESS:
      return {
        ...state,
        fetching: false,
        userData: actions.payload
      }

    case usersActions.GET_EXAM_USER_ERROR:
      return {
        ...state,
        fetching: false,
        error: actions.payload
      }
    
    default:
      return state
  }
}