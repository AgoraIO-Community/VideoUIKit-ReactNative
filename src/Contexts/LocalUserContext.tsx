import React, {useContext, createContext} from 'react';
import MaxUidContext from './MaxUidContext';
import MinUidContext from './MinUidContext';
import {UidInterface} from './PropsContext';

export const LocalContext = createContext<UidInterface>({} as UidInterface);
export const LocalProvider = LocalContext.Provider;
export const LocalConsumer = LocalContext.Consumer;

interface LocalUserContextInterface {
  children: React.ReactNode;
}

const LocalUserContext: React.FC<LocalUserContextInterface> = (props) => {
  const max = useContext(MaxUidContext);
  const min = useContext(MinUidContext);
  // if(min && min[0] && max )
  let localUser: UidInterface = max[0].uid === 'local' ? max[0] : min[0];
  return (
    <LocalContext.Provider value={localUser}>
      {props.children}
    </LocalContext.Provider>
  );
};

export default LocalUserContext;
