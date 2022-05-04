import {
  createContext,
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useState,
} from 'react';

import User from '../model/User';

interface IUserContext {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

const visitor:User ={
  id:0,
  username:'visitor',
  data:{
    settings:{
      saveOnClose:false,
      saveOnSend:false
    }
  }
}

const UserContext = createContext<IUserContext>({
  user: visitor,
  setUser: () => {},
});

const UserProvider: FunctionComponent = ({ children }) => {
  const [user, setUser] = useState<User>(visitor);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext,visitor };

export default UserProvider;
