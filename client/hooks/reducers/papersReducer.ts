import { papersActions } from "../actions/papersActions"

export const initialState = {
  fetching: false,
  papersList: [],
  paper: {},
  error: null
}

export const papersReducer = (state: any, actions: any) => {
  switch (actions.type) {
    case papersActions.CREATE_PAPER:
      return {
        ...state,
        fetching: true,
      }
    
    case papersActions.CREATE_PAPER_SUCCESS:
      return {
        ...state,
        fetching: false,
        papersList: actions.payload,
        ok: true,
      }
    
    case papersActions.CREATE_PAPER_ERROR:
      return {
        ...state,
        fetching: false,
        error: actions.payload
      }

    case papersActions.GET_PAPERS:
      return {
        ...state,
        fetching: true,
      }

    case papersActions.GET_PAPERS_SUCCESS:
      return {
        ...state,
        fetching: false,
        paper: actions.payload,
        ok: true,
      }

    case papersActions.GET_PAPERS_ERROR:
      return {
        ...state,
        fetching: false,
        error: actions.payload,
      }

    default:
      return state
  }
}