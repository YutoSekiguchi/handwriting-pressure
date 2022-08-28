import axios from 'axios';
import React, { useMemo, useReducer, createContext, useContext } from 'react'
import { logsActions } from '../actions/logsActions';
import { initialState, logsReducer } from '../reducers/logsReducer';

const LogsContext = createContext(null);

type LogObj = {
  UID: number,
  PDID: number,
  StrokeData: string,
  Url: string,
  PressureList: string
}

export const LogsProvider = (props: any) => {
  const url = process.env.API_URL;
  const [state, dispatch] = useReducer(logsReducer, initialState);

  // pdidを指定してそのノートにあるログを表示
  const getLogsByPDID = async(pdid: number) => {
    try {
      dispatch({ type: logsActions.GET_LOGS });
      const res = await axios.get(`${url}/logs/paper/${pdid}`);
      if (res.status===200) {
        dispatch({ type: logsActions.GET_LOGS_SUCCESS, payload: res.data });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: logsActions.GET_LOGS_ERROR, payload: error });
    }
  }

  // logの追加
  const createLog = async(data: LogObj) => {
    try {
      dispatch({ type: logsActions.CREATE_LOG });
      const res = await axios.post(`${url}/logs`, data);
      if (res.status===200) {
        dispatch({ type: logsActions.CREATE_LOG_SUCCESS, payload: res.data });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: logsActions.CREATE_LOG_ERROR, payload: error });
    }
  }

  const value = useMemo(() => {
    return {
      state,
      getLogsByPDID,
      createLog
    }
  }, [state]);

  return <LogsContext.Provider value={value} {...props} />
}

export const useLogs = () => {
  const context = useContext(LogsContext);
  if (!context) {
    throw Error('useLogs is out Provider');
  }
  return context;
}