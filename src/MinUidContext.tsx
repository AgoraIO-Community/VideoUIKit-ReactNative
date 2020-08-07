import React from 'react';
import {UidStateInterface} from './RtcContext';

const MinUidContext = React.createContext<UidStateInterface['min']>([]);

export const MinUidProvider = MinUidContext.Provider;
export const MinUidConsumer = MinUidContext.Consumer;
export default MinUidContext;
