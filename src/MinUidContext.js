import React from 'react';

const MinUidContext = React.createContext({});

export const MinUidProvider = MinUidContext.Provider;
export const MinUidConsumer = MinUidContext.Consumer;
export default MinUidContext;
