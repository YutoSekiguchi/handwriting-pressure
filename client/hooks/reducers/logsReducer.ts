import { logsActions } from "../actions/logsActions"

export const initialState = {
  fetching: false,
  logsList: [],
  log: {},
  error: null
}

export const logsReducer = (state: any, actions: any) => {
  switch (actions.type) {
    case logsActions.CREATE_LOG:
      return {
        ...state,
        fetching: true,
      }
    
    case logsActions.CREATE_LOG_SUCCESS:
      return {
        ...state,
        fetching: false,
        log: actions.payload,
        ok: true,
      }

    case logsActions.CREATE_LOG_ERROR:
      return {
        ...state,
        fetching: false,
        error: actions.payload,
      }
    
    case logsActions.GET_LOGS:
      return {
        ...state,
        fetching: true,
      }

    case logsActions.GET_LOGS_SUCCESS:
      return {
        ...state,
        fetching: false,
        logsList: actions.payload,
        ok: true,
      }

    case logsActions.GET_LOGS_ERROR:
      return {
        ...state,
        fetching: false,
        error: actions.payload,
      }
    
    default:
      return state
  }
}