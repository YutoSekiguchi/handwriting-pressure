import axios from 'axios';
import React, { useMemo, useReducer, createContext, useContext } from 'react'
import { papersActions } from '../actions/papersActions';
import { initialState, papersReducer } from '../reducers/papersReducer';

const PapersContext = createContext(null);

type PaperObj = {
  UID: number,
  Name: string,
}

export const PapersProvider = (props: any) => {
  const url = process.env.API_URL;
  const [state, dispatch] = useReducer(papersReducer, initialState);

  // uidを指定してpapersのListを取得
  const getPapersByUID = async(uid: number) => {
    try {
      dispatch({ type: papersActions.GET_PAPERS });
      const res = await axios.get(`${url}/papers/list/${uid}`);
      if (res.status===200) {
        dispatch({ type: papersActions.GET_PAPERS_SUCCESS, payload: res.data });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: papersActions.GET_PAPERS_ERROR, payload: error });
    }
  }

  // papersの追加
  const createPaper = async(data: PaperObj) => {
    try {
      dispatch({ type: papersActions.CREATE_PAPER });
      const res = await axios.post(`${url}/papers`, data);
      if (res.status === 200) {
        dispatch({ type: papersActions.CREATE_PAPER_SUCCESS, payload: res.data });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: papersActions.CREATE_PAPER_ERROR, payload: error });
    }
  }

  const value = useMemo(() => {
    return {
      state,
      getPapersByUID,
      createPaper,
    }
  }, [state]);

  return <PapersContext.Provider value={value} {...props} />
}

export const usePapers = () => {
  const context = useContext(PapersContext);
  if (!context) {
    throw Error('useUsers is out Provider');
  }
  return context;
}