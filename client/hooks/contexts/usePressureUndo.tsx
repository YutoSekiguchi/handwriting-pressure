import axios from 'axios';
import React, { useMemo, useReducer, createContext, useContext } from 'react'
import { usePressureUndoActions } from '../actions/usePressureUndo';
import { initialState, usePressureUndoReducer } from '../reducers/usePressureUndo';

const UsePressureUndoContext = createContext(null);

type UsePressureUndoObj = {
  UID: number,
  PDID: number,
  Pressure: number,
  Count: number
}

export const UsePressureUndoProvider = (props: any) => {
  const url = process.env.API_URL;
  const [state, dispatch] = useReducer(usePressureUndoReducer, initialState);

  // 登録
  const createUsePressureUndo = async(data: UsePressureUndoObj) => {
    try {
      dispatch({ type: usePressureUndoActions.CREATE_USE_PRESSURE_UNDO });
      const res = await axios.post(`${url}/use-pressure-undo`, data);
      if (res.status == 200) {
        dispatch({ type: usePressureUndoActions.CREATE_USE_PRESSURE_UNDO_SUCCESS, payload: res.data });
      }
    } catch (e) {
      console.log(e);
      dispatch({ type: usePressureUndoActions.CREATE_USE_PRESSURE_UNDO_ERROR, payload: e });
    }
  }

  const value = useMemo(() => {
    return {
      state,
      createUsePressureUndo
    }
  }, [state]);

  return <UsePressureUndoContext.Provider value={value} {...props} />
}

export const useUsePressureUndo = () => {
  const context = useContext(UsePressureUndoContext);
  if (!context) {
    throw Error('usePressureUndo is out Provider');
  }
  return context;
}