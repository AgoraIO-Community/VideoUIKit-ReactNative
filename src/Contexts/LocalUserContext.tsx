import React, {useContext, createContext} from 'react';
import RenderContext from './RenderContext';
import {RenderInterface} from './PropsContext';
import {UidType} from './RtcContext';

export const LocalContext = createContext<RenderInterface>(
  {} as RenderInterface,
);
export const LocalProvider = LocalContext.Provider;
export const LocalConsumer = LocalContext.Consumer;

interface LocalUserContextInterface {
  children: React.ReactNode;
  localUid: UidType;
}

const LocalUserContext: React.FC<LocalUserContextInterface> = (props) => {
  const {renderList, activeUids} = useContext(RenderContext);
  let localUser: RenderInterface =
    renderList[
      props?.localUid || (activeUids && activeUids.length) ? activeUids[0] : 0
    ];
  if (!localUser) {
    console.error("Error: we couldn't find the local user data");
    return null;
  }
  return (
    <LocalContext.Provider value={localUser}>
      {props.children}
    </LocalContext.Provider>
  );
};

export default LocalUserContext;
