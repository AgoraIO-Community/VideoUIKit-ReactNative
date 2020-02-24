import React from 'react';

const RtcContext = React.createContext({});

export const RtcProvider = RtcContext.Provider;
export const RtcConsumer = RtcContext.Consumer;
export default RtcContext;
