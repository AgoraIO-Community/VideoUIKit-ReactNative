import React from 'react';

const MaxUidContext = React.createContext({});

export const MaxUidProvider = MaxUidContext.Provider;
export const MaxUidConsumer = MaxUidContext.Consumer;
export default MaxUidContext;
