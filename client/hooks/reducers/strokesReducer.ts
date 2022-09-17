import { strokesActions } from "../actions/strokesActions";

export const initialState = {
  fetching: false,
  strokes: [],
  stroke: {},
  error: null,
}

export const strokeReducer = (state: any, actions: any) => {
  switch (actions.type) {
    case strokesActions.GET_STROKES:
      return {
        ...state,
        fetching: true,
      }

    case strokesActions.GET_STROKES_SUCCESS:
      return {
        ...state,
        fetching: false,
        strokes: actions.payload,
        ok: true
      }

      case strokesActions.GET_STROKES_ERROR:
        return {
          ...state,
          fetching: false,
          error: actions.payload
        }

    case strokesActions.CREATE_STROKE:
      return {
        ...state,
        fetching: true,
      }

    case strokesActions.CREATE_STROKE_SUCCESS:
      return {
        ...state,
        fetching: false,
        stroke: actions.payload,
        ok: true,
      }

    case strokesActions.CREATE_STROKE_ERROR:
      return {
        ...state,
        fetching: false,
        error: actions.payload
      }

    case strokesActions.DELETE_STROKES:
      return {
        ...state,
        fetching: true,
      }

    case strokesActions.DELETE_STROKES_SUCCESS:
      return {
        ...state,
        fetching: false,
        ok: true,
      }

    case strokesActions.DELETE_STROKES_ERROR:
      return {
        ...state,
        fetching: false,
        error: actions.payload
      }
    
    default:
      return state
  }
}