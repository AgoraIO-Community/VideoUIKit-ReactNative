import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { ClientRoleType } from 'react-native-agora';
import MaxUidContext, { MaxUidConsumer } from '../Contexts/MaxUidContext';
import MinUidContext, { MinUidConsumer } from '../Contexts/MinUidContext';
import PropsContext from '../Contexts/PropsContext';
import styles from '../Style';
import MaxVideoView from './MaxVideoView';
import MinVideoView from './MinVideoView';

const PinnedVideo: React.FC = () => {
  const {rtcProps, styleProps} = useContext(PropsContext);
  const [width, setWidth] = useState(Dimensions.get('screen').width);

  const max = useContext(MaxUidContext);
  const min = useContext(MinUidContext);
  const users =
    rtcProps.role === ClientRoleType.ClientRoleAudience
      ? [...max, ...min].filter((user) => user.uid !== 'local')
      : [...max, ...min];

  console.log('users', users)

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
      {users.length > 1 &&

      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        style={{
          ...styles.minContainer,
          width: width,
          ...(styleProps?.minViewContainer as Object),
        }}>
          <MinUidConsumer>
          {(minUsers) =>
            minUsers.map((user) =>
              rtcProps.role === ClientRoleType.ClientRoleAudience &&
              user.uid === 'local' ? null : (
                <MinVideoView user={user} key={user.uid} showOverlay={true} />
              ),
            )
              }
        </MinUidConsumer>
      </ScrollView>
      }

    </>
  );
};

export default PinnedVideo;
