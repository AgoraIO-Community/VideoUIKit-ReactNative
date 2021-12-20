import React from 'react';
import {UidStateInterface} from './RtcContext';

const MaxUidContext = React.createContext<UidStateInterface['max']>([]);
export const MaxUidProvider = MaxUidContext.Provider;
export const MaxUidConsumer = MaxUidContext.Consumer;
export default MaxUidContext;
