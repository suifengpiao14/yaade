import { FunctionComponent } from 'react';

import CollectionsProvider, { CollectionsContext } from './CollectionsContext';
import CurrentRequestProvider, { CurrentRequestContext } from './CurrentRequestContext';
import UserProvider, { UserContext } from './UserContext';
import GlobalProvider, { GlobalContext } from './GlobalContext';

const ContextProvider: FunctionComponent = ({ children }) => {
  return (
    <CollectionsProvider>
      <CurrentRequestProvider>
        <GlobalProvider>
          <UserProvider>{children}</UserProvider>
        </GlobalProvider>
      </CurrentRequestProvider>
    </CollectionsProvider>
  );
};

export { CollectionsContext, CurrentRequestContext, UserContext ,GlobalContext};

export default ContextProvider;
