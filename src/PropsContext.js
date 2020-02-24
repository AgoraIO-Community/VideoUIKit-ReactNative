import React from 'react';

const PropsContext = React.createContext({});

export const PropsProvider = PropsContext.Provider;
export const PropsConsumer = PropsContext.Consumer;

export default PropsContext;