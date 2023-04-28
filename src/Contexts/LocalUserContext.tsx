import React, {useContext, createContext} from 'react';
import ContentContext from './ContentContext';
import {ContentInterface} from './PropsContext';
import {UidType} from './RtcContext';

export const LocalContext = createContext<ContentInterface>(
  {} as ContentInterface,
);
export const LocalProvider = LocalContext.Provider;
export const LocalConsumer = LocalContext.Consumer;

interface LocalUserContextInterface {
  children: React.ReactNode;
  localUid: UidType;
}

const LocalUserContext: React.FC<LocalUserContextInterface> = (props) => {
  const {defaultContent} = useContext(ContentContext);
  if (!props?.localUid) {
    console.error('Error: local user id is empty');
    return null;
  }
  let localUser: ContentInterface = defaultContent[props?.localUid];
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
