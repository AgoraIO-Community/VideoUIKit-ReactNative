import React, {useContext, createContext} from 'react';
import MaxUidContext from './MaxUidContext';
import MinUidContext from './MinUidContext';
import {UidInterface} from './RtcContext';

export const LocalContext = createContext<UidInterface>({} as UidInterface);
export const LocalProvider = LocalContext.Provider;
export const LocalConsumer = LocalContext.Consumer;

interface LocalUserContextInterface {
  children: React.ReactNode;
}

const LocalUserContext: React.FC<LocalUserContextInterface> = (props) => {
  const max = useContext(MaxUidContext);
  const min = useContext(MinUidContext);
  let localUser: UidInterface = min[0].uid === 'local' ? min[0] : max[0];
  return (
    <LocalContext.Provider value={localUser}>
      {props.children}
    </LocalContext.Provider>
  );
};

export default LocalUserContext;
