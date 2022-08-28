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
  PaperJson: string,
  PressureList: string,
  BackgroundImage: string,
}

export const PaperDetailsProvider = (props: any) => {
  const url = process.env.API_URL;
  const [state, dispatch] = useReducer(papersDetailReducer, initialState);

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
      dispatch({ type: papersDetailActions.CREATE_PAPER_DETAIL_ERROR, payload: error });
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

  const value = useMemo(() => {
    return {
      state,
      getPaperDetailsByPID,
      createPaperDetail,
    }
  }, [state]);

  return <PaperDetailsContext.Provider value={value} {...props} />
}

export const usePaperDetails = () => {
  const context = useContext(PaperDetailsContext);
  if(!context) {
    throw Error('useUsers is out Provider');
  }
  return context;
}