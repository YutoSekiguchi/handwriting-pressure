import React, { ReactNode } from 'react'
import { LogsProvider } from './logsContext';
import { PaperDetailsProvider } from './paperDetailsContext';
import { PapersProvider } from './papersContext';
import { UsersProvider } from './usersContext'

const AppProvider = (props: { children: ReactNode }) => {
  return (
    <UsersProvider>
      <LogsProvider>
        <PapersProvider>
          <PaperDetailsProvider>
            {props.children}
          </PaperDetailsProvider>
        </PapersProvider>
      </LogsProvider>
    </UsersProvider>
  )
}

export default AppProvider;