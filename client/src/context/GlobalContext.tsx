import {
  createContext,
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useState,
} from 'react';

import Global from '../model/Global';
import Collection from '../model/Collection';

const defaultGlobal: Global = {
  type: 'REST',
  version: '1.0.0',
  data: {
    variables:[
      {
        key: '',
        value: '',
      },
    ],
    proxy:'', 
  },
  isLoading: false,
  collectionId: -1,
  changed: false,
};

function parseGlobal(Collection: Collection): Global {
  return {
    collectionId: Collection.id,
    type: 'REST',
    version: "1.0.0",
    data: Collection.data?.global,
    isLoading: false,
    changed: false,
  };
}

interface IGlobalContext {
  global: any;
  setGlobal: Dispatch<SetStateAction<Global>>;
  saveGlobal: () => Promise<void>;
  changeGlobal: (global: Global) => void;
}

const GlobalContext = createContext<IGlobalContext>({
  global: defaultGlobal,
  setGlobal: () => {},
  saveGlobal: async () => {},
  changeGlobal: () => {},
});

const GlobalProvider: FunctionComponent = ({ children }) => {
  const [global, setGlobal] = useState<Global>(defaultGlobal);

  function changeGlobal(global: Global) {
    setGlobal({
      ...global,
      changed: true,
    });
  }

  async function _sendSaveGlobal(method: string, body: any): Promise<Response> {
    const response = await fetch('/api/global', {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (response.status !== 200) throw new Error();
    return response;
  }

  async function saveGlobal(): Promise<void> {
    await _sendSaveGlobal('PUT', global);
  }


  return (
    <GlobalContext.Provider
      value={{
        global: global,
        setGlobal: setGlobal,
        saveGlobal: saveGlobal,
        changeGlobal,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, defaultGlobal ,parseGlobal};

export default GlobalProvider;
