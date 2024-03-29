import axios from 'axios';
import React, { useMemo, useReducer, createContext, useContext } from 'react'
import { papersDetailActions } from '../actions/paperDetailsActions';
import { initialState, papersDetailReducer } from '../reducers/paperDetailsReducer';

const PaperDetailsContext = createContext(null);

type PaperDetailObj = {
  PID: number,
  UID: number,
  Title: string,
  PaperWidth: number,
  PaperHeight: number,
  PaperImage: string,
  PaperJson: string,
  PressureList: string,
  IsShowStrokeList: string,
  BoundaryPressure: number,
  AvgPressure: number,
  BackgroundImage: string,
}

export const PaperDetailsProvider = (props: any) => {
  const url = process.env.API_URL;
  const [state, dispatch] = useReducer(papersDetailReducer, initialState);

  // 筆圧undoを使用したpaperを全て取得
  const getPaperDetailsWithPressureUndo = async() => {
    try {
      dispatch({ type: papersDetailActions.GET_PAPER_DETAILS_WITH_PRESSURE_UNDO });
      const res = await axios.get(`${url}/paper-details/pressureundo`);
      if (res.status===200) {
        dispatch({ type: papersDetailActions.GET_PAPER_DETAILS_WITH_PRESSURE_UNDO_SUCCESS, payload: res.data });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: papersDetailActions.GET_PAPER_DETAILS_WITH_PRESSURE_UNDO_ERROR, payload: error });
    }
  }

  // 筆圧undoを使用してないpaperを全て取得
  const getPaperDetailsWithNotPressureUndo = async() => {
    try {
      dispatch({ type: papersDetailActions.GET_PAPER_DETAILS_WITH_NOT_PRESSURE_UNDO });
      const res = await axios.get(`${url}/paper-details/notpressureundo`);
      if (res.status===200) {
        dispatch({ type: papersDetailActions.GET_PAPER_DETAILS_WITH_NOT_PRESSURE_UNDO_SUCCESS, payload: res.data });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: papersDetailActions.GET_PAPER_DETAILS_WITH_NOT_PRESSURE_UNDO_ERROR, payload: error });
    }
  }

  // idを指定してpaper_detailの取得
  const getPaperDetailByID = async(id: number) => {
    try {
      dispatch({ type: papersDetailActions.GET_PAPER_DETAIL });
      const res = await axios.get(`${url}/paper-details/${id}`);
      if (res.status===200) {
        dispatch({ type: papersDetailActions.GET_PAPER_DETAIL_SUCCESS, payload: res.data });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: papersDetailActions.GET_PAPER_DETAIL_ERROR, payload: error });
    }
  }

  // pidを指定してpapersの中に入ってるpaper_detailを全て取得
  const getPaperDetailsByPID = async(pid: number) => {
    try {
      dispatch({ type: papersDetailActions.GET_PAPER_DETAILS });
      const res = await axios.get(`${url}/paper-details/list/${pid}/folder`);
      if (res.status===200) {
        dispatch({ type: papersDetailActions.GET_PAPER_DETAILS_SUCCESS, payload: res.data });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: papersDetailActions.GET_PAPER_DETAILS_ERROR, payload: error });
    }
  }

  // paper_detailの追加
  const createPaperDetail = async(data: PaperDetailObj) => {
    try {
      dispatch({ type: papersDetailActions.CREATE_PAPER_DETAIL });
      const res = await axios.post(`${url}/paper-details`, data);
      if (res.status === 200) {
        dispatch({ type: papersDetailActions.CREATE_PAPER_DETAIL_SUCCESS, payload: res.data });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: papersDetailActions.CREATE_PAPER_DETAIL_ERROR, payload: error });
    }
  }

  // paper_detailの編集
  const updatePaperDetail = async(id: number, data: PaperDetailObj) => {
    try {
      dispatch({ type: papersDetailActions.GET_PAPER_DETAIL });
      const res = await axios.put(`${url}/paper-details/${id}`, data);
      if (res.status === 200) {
        dispatch({ type: papersDetailActions.GET_PAPER_DETAIL_SUCCESS, payload: res.data });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: papersDetailActions.GET_PAPER_DETAIL_ERROR, payload: error });
    }
  }

  // paper_detailの削除
  const deletePaperDetail = async(pdid: number) => {
    try {
      dispatch({ type: papersDetailActions.DELETE_PAPER_DETAIL });
      const res = await axios.delete(`${url}/paper-details/${pdid}`);
      if (res.status === 200) {
        dispatch({ type: papersDetailActions.DELETE_PAPER_DETAIL_SUCCESS });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: papersDetailActions.DELETE_PAPER_DETAIL_ERROR, payload: error });
    }
  }

  const value = useMemo(() => {
    return {
      state,
      getPaperDetailsWithPressureUndo,
      getPaperDetailsWithNotPressureUndo,
      getPaperDetailByID,
      getPaperDetailsByPID,
      createPaperDetail,
      updatePaperDetail,
      deletePaperDetail,
    }
  }, [state]);

  return <PaperDetailsContext.Provider value={value} {...props} />
}

export const usePaperDetails = () => {
  const context = useContext(PaperDetailsContext);
  if(!context) {
    throw Error('usePaperDetails is out Provider');
  }
  return context;
}