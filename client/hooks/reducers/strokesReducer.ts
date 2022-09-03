import { strokesActions } from "../actions/strokesActions";

export const initialState = {
  fetching: false,
  stroke: {},
  error: null,
}

export const strokeReducer = (state: any, actions: any) => {
  switch (actions.type) {
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
    
    default:
      return state
  }
}