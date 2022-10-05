import { usePressureUndoActions } from "../actions/usePressureUndo";

export const initialState = {
  fetching: false,
  usePressureUndoData: {},
  error: null
}

export const usePressureUndoReducer = (state: any, actions: any) => {
  switch (actions.type) {
    case usePressureUndoActions.CREATE_USE_PRESSURE_UNDO:
      return {
        ...state,
        fetching: true,
      }
    case usePressureUndoActions.CREATE_USE_PRESSURE_UNDO_SUCCESS:
      return {
        ...state,
        fetching: false,
        usePressureUndoData: actions.payload,
        ok: true
      }
    case usePressureUndoActions.CREATE_USE_PRESSURE_UNDO_ERROR:
      return {
        ...state,
        fetching: false,
        error: actions.payload
      }
    default:
      return state
  }
}