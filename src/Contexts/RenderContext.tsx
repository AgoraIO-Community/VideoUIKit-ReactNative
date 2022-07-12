import React from 'react';
import {RenderStateInterface} from './RtcContext';

const RenderContext = React.createContext<RenderStateInterface>(
  {} as RenderStateInterface,
);

export const RenderProvider = RenderContext.Provider;
export const RenderConsumer = RenderContext.Consumer;
export default RenderContext;
