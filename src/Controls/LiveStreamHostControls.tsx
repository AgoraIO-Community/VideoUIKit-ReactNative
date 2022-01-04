import React from 'react';
import {UidInterface} from '../Contexts/PropsContext';
import RemoteLiveStreamRequestApprove from './Remote/RemoteLiveStreamRequestApprove';
import RemoteLiveStreamRequestReject from './Remote/RemoteLiveStreamRequestReject';

interface LiveStreamHostControlsInterface {
  user?: UidInterface;
}

const LiveStreamHostControls: React.FC<LiveStreamHostControlsInterface> = (
  props,
) => {
  const {user} = props;
  return (
    <>
      <RemoteLiveStreamRequestApprove user={user} />
      <RemoteLiveStreamRequestReject user={user} />
    </>
  );
};

export default LiveStreamHostControls;
