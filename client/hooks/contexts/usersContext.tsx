import React, { useMemo, useReducer, createContext, useContext } from 'react'
import { initialState, usersReducer } from '../reducers/usersReducer'
import { usersActions } from '../actions/usersActions'
import axios from 'axios'

const UsersContext = createContext(null);

type ExamUserObj = {
  Name: string,
  Password: string,
  Gender: 'male'|'female',
  Age: number
}

export const UsersProvider = (props: any) => {
  const url = process.env.API_URL;
  const [state, dispatch] = useReducer(usersReducer, initialState);

  // ユーザの一覧を取得
  const getAllExamUsers = async() => {
    try {
      dispatch({ type: usersActions.GET_ALL_EXAM_USERS });
      const res = await axios.get(`${url}/examusers`);
      if (res.status === 200) {
        dispatch({ type: usersActions.GET_ALL_EXAM_USERS_SUCCESS, payload: res.data });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: usersActions.GET_ALL_EXAM_USERS_ERROR, payload: error });
    }
  }

  // NameとPasswordからユーザを取得
  const getExamUserByNameAndPassword = async(name: string, password: string) => {
    try {
      dispatch({ type: usersActions.GET_EXAM_USER });
      const res = await axios.get(`${url}/examusers/me?Name=${name}&Password=${password}`)
      console.log(res);
      if (res.status === 200) {
        dispatch({ type: usersActions.GET_EXAM_USER_SUCCESS, payload: res.data });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: usersActions.GET_ALL_EXAM_USERS_ERROR, payload: error });
    }
  }

  // ユーザの追加
  const createExamUser = async(data: ExamUserObj) => {
    try {
      dispatch({ type: usersActions.CREATE_EXAM_USER });
      const res = await axios.post(`${url}/examusers`, data);
      if (res.status === 200) {
        dispatch({ type: usersActions.CREATE_EXAM_USER_SUCCESS, payload: res.data });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: usersActions.CREATE_EXAM_USER_ERROR, payload: error });
    }
  }

  // サインイン
  const signIn = async(name: string, password: string, data: ExamUserObj) => {
    try {
      const res = await axios.get(`${url}/examusers/me?Name=${name}&Password=${password}`);
      if (res.data != null) {
        alert('このユーザは既に存在します');
        return;
      } else {
        createExamUser(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const value = useMemo(() => {
    return {
      state,
      getAllExamUsers,
      getExamUserByNameAndPassword,
      createExamUser,
      signIn
    }
  }, [state]);

  return <UsersContext.Provider value={value} {...props} />
}

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw Error('useUsers is out Provider');
  }
  return context;
}