import { papersDetailActions } from "../actions/paperDetailsActions"

export const initialState = {
  fetching: false,
  paperDetailsList: [],
  paperDetailsWithPressureUndoList: [],
  paperDetailsWithNotPressureUndoList: [],
  paperDetail: {},
  error: null,
}

export const papersDetailReducer = (state: any, actions: any) => {
  switch (actions.type) {
    case papersDetailActions.CREATE_PAPER_DETAIL:
      return {
        ...state,
        fetching: true,
      }

    case papersDetailActions.CREATE_PAPER_DETAIL_SUCCESS:
      return {
        ...state,
        fetching: false,
        paperDetail: actions.payload,
        ok: true,
      }

    case papersDetailActions.CREATE_PAPER_DETAIL_ERROR:
      return {
        ...state,
        fetching: false,
        error: actions.payload
      }

    case papersDetailActions.GET_PAPER_DETAIL:
      return {
        ...state,
        fetching: true,
      }

    case papersDetailActions.GET_PAPER_DETAIL_SUCCESS:
      return {
        ...state,
        fetching: false,
        paperDetail: actions.payload,
        ok: true,
      }
    
    case papersDetailActions.GET_PAPER_DETAIL_ERROR:
      return {
        ...state,
        fetching: false,
        error: actions.payload
      }
    
    case papersDetailActions.GET_PAPER_DETAILS:
      return {
        ...state,
        fetching: true,
      }

    case papersDetailActions.GET_PAPER_DETAILS_SUCCESS:
      return {
        ...state,
        fetching: false,
        paperDetailsList: actions.payload,
        ok: true,
      }
    
    case papersDetailActions.GET_PAPER_DETAILS_ERROR:
      return {
        ...state,
        fetching: false,
        error: actions.payload
      }

    case papersDetailActions.GET_PAPER_DETAILS_WITH_PRESSURE_UNDO:
      return {
        ...state,
        fetching: true,
      }

    case papersDetailActions.GET_PAPER_DETAILS_WITH_PRESSURE_UNDO_SUCCESS:
      return {
        ...state,
        fetching: false,
        paperDetailsWithPressureUndoList: actions.payload,
        ok: true,
      }
    
    case papersDetailActions.GET_PAPER_DETAILS_WITH_PRESSURE_UNDO_ERROR:
      return {
        ...state,
        fetching: false,
        error: actions.payload
      }

    case papersDetailActions.GET_PAPER_DETAILS_WITH_NOT_PRESSURE_UNDO:
      return {
        ...state,
        fetching: true,
      }

    case papersDetailActions.GET_PAPER_DETAILS_WITH_NOT_PRESSURE_UNDO_SUCCESS:
      return {
        ...state,
        fetching: false,
        paperDetailsWithNotPressureUndoList: actions.payload,
        ok: true,
      }
    
    case papersDetailActions.GET_PAPER_DETAILS_WITH_NOT_PRESSURE_UNDO_ERROR:
      return {
        ...state,
        fetching: false,
        error: actions.payload
      }

    case papersDetailActions.DELETE_PAPER_DETAIL:
      return {
        ...state,
        fetching: true,
      }
    
    case papersDetailActions.DELETE_PAPER_DETAIL_SUCCESS:
      return {
        ...state,
        fetching: false,
        ok: true,
      }
    
    case papersDetailActions.DELETE_PAPER_DETAIL_ERROR:
      return {
        ...state,
        fetching: false,
        error: actions.payload
      }
    default:
      return state
  }
}