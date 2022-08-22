import React, { useMemo, useReducer, createContext, useContext, ReactNode, useState } from 'react'
import { initialState } from '../reducers/usersReducer'
import { UsersProvider } from './usersContext'

const AppProvider = (props: { children: ReactNode }) => {
  return (
    <UsersProvider>
      {props.children}
    </UsersProvider>
  )
}

export default AppProvider;