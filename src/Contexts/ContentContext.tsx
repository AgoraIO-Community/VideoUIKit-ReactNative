import React from 'react';
import {ContentStateInterface} from './RtcContext';

const ContentContext = React.createContext<ContentStateInterface>(
  {} as ContentStateInterface,
);

export const ContentProvider = ContentContext.Provider;
export const ContentConsumer = ContentContext.Consumer;
export default ContentContext;
