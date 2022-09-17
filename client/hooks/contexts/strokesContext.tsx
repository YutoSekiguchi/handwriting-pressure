import axios from 'axios';
import React, { useMemo, useReducer, createContext, useContext } from 'react'
import { strokesActions } from '../actions/strokesActions';
import { initialState, strokeReducer } from '../reducers/strokesReducer';

const StrokesContext = createContext(null);

type StrokeObj = {
  UID: number,
  PDID: number,
  Detail: string,
  AvgPressure: number,
  PressureList: string,
  Time: number,
  Mode: string,
}

export const StrokesProvider = (props: any) => {
  const url = process.env.API_URL;
  const [state, dispatch] = useReducer(strokeReducer, initialState);

  // ノートのstrokeの取得
  const fetchStrokesByPDID = async(pdid: number) => {
    try {
      dispatch({ type: strokesActions.GET_STROKES });
      const res = await axios.get(`${url}/strokes/paper/${pdid}`);
      if (res.status === 200) {
        dispatch({ type: strokesActions.GET_STROKES_SUCCESS, payload: res.data });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: strokesActions.GET_STROKES_ERROR, payload: error });
    }
  }

  // strokeの追加
  const createStroke = async(data: StrokeObj) => {
    try {
      dispatch({ type: strokesActions.CREATE_STROKE });
      const res = await axios.post(`${url}/strokes`, data);
      if (res.status === 200) {
        dispatch({ type: strokesActions.CREATE_STROKE_SUCCESS, payload: res.data });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: strokesActions.CREATE_STROKE_ERROR, payload: error });
    }
  }

  // strokeの編集
  const updateStroke = async(pdid: number) => {
    try {
      dispatch({ type: strokesActions.GET_STROKES });
      const res = await axios.put(`${url}/strokes/${pdid}`);
      if (res.status == 200) {
        dispatch({ type: strokesActions.GET_STROKES_SUCCESS, payload: res.data });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: strokesActions.GET_STROKES_ERROR, payload: error });
    }
  }

  // 保存されてないstrokeの削除
  const deleteNotSaveStrokes = async(pdid: number) => {
    try {
      dispatch({ type: strokesActions.DELETE_STROKES });
      const res = await axios.delete(`${url}/strokes/unsave/${pdid}`);
      if (res.status == 200) {
        dispatch({ type: strokesActions.DELETE_STROKES_SUCCESS });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: strokesActions.DELETE_STROKES_ERROR, payload: error });
    }
  }

  const value = useMemo(() => {
    return {
      state,
      fetchStrokesByPDID,
      createStroke,
      updateStroke,
      deleteNotSaveStrokes
    }
  }, [state]);

  return <StrokesContext.Provider value={value} {...props} />
}

export const useStrokes = () => {
  const context = useContext(StrokesContext);
  if(!context) {
    throw Error('useStrokes is out Provider');
  }
  return context;
}