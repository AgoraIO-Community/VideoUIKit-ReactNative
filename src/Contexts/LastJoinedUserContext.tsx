import React from 'react';
import {RenderInterface} from './PropsContext';

const LastJoinedUserContext = React.createContext<{
  lastUserJoined?: RenderInterface;
}>({});

export const LastJoinedUserProvider = LastJoinedUserContext.Provider;
export const LastJoinedUserConsumer = LastJoinedUserContext.Consumer;
export default LastJoinedUserContext;
