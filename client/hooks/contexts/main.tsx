import React, { ReactNode } from 'react'
import { LogsProvider } from './logsContext';
import { PaperDetailsProvider } from './paperDetailsContext';
import { PapersProvider } from './papersContext';
import { StrokesProvider } from './strokesContext';
import { UsersProvider } from './usersContext'
import { UsePressureUndoProvider } from './usePressureUndo';

const AppProvider = (props: { children: ReactNode }) => {
  return (
    <UsersProvider>
      <LogsProvider>
        <PapersProvider>
          <PaperDetailsProvider>
            <StrokesProvider>
              <UsePressureUndoProvider>
                {props.children}
              </UsePressureUndoProvider>
            </StrokesProvider>
          </PaperDetailsProvider>
        </PapersProvider>
      </LogsProvider>
    </UsersProvider>
  )
}

export default AppProvider;