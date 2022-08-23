import React, { ReactNode } from 'react'
import { UsersProvider } from './usersContext'

const AppProvider = (props: { children: ReactNode }) => {
  return (
    <UsersProvider>
      {props.children}
    </UsersProvider>
  )
}

export default AppProvider;