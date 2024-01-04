import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { ClientRoleType } from 'react-native-agora';
import { MaxUidConsumer } from '../Contexts/MaxUidContext';
import { MinUidConsumer } from '../Contexts/MinUidContext';
import PropsContext from '../Contexts/PropsContext';
import styles from '../Style';
import MaxVideoView from './MaxVideoView';
import MinVideoView from './MinVideoView';

const PinnedVideo: React.FC = () => {
  const {rtcProps, styleProps} = useContext(PropsContext);
  const [width, setWidth] = useState(Dimensions.get('screen').width);

  useEffect(() => {
    Dimensions.addEventListener('change', () => {
      setWidth(Dimensions.get('screen').width);
    });
  });

  return (
    <>
      <MaxUidConsumer>
        {(maxUsers) =>
          maxUsers[0] ? ( // check if audience & live don't render if uid === local
            <MaxVideoView user={maxUsers[0]} key={maxUsers[0].uid} />
          ) : null
        }
      </MaxUidConsumer>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        style={{
          ...styles.minContainer,
          width: width,
          ...(styleProps?.minViewContainer as Object),
        }}>
          <>
          {(minUsers) => {
            return (<MinUidConsumer>
              {minUsers.map((user) =>
              rtcProps.role === ClientRoleType.ClientRoleAudience &&
              user.uid === 'local' ? null : (
                <MinVideoView user={user} key={user.uid} showOverlay={true} />
              ))}
            </MinUidConsumer>)
          }}
         </>
      </ScrollView>
    </>
  );
};

export default PinnedVideo;
