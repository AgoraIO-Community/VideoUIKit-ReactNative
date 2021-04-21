import React, {useContext} from 'react';
import {ScrollView} from 'react-native';
import MaxVideoView from './MaxVideoView';
import MinVideoView from './MinVideoView';
import {MinUidConsumer} from './MinUidContext';
import {MaxUidConsumer} from './MaxUidContext';
import styles from './Style';
import LocalControls from './Controls/LocalControls';
import PropsContext, {mode, role} from './PropsContext';

const PinnedVideo: React.FC = () => {
  const {rtcProps} = useContext(PropsContext);
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
        style={styles.minContainer}>
        <MinUidConsumer>
          {(minUsers) =>
            minUsers.map((user) =>
              rtcProps.role === role.Audience &&
              user.uid === 'local' ? null : (
                <MinVideoView user={user} key={user.uid} showOverlay={true} />
              ),
            )
          }
        </MinUidConsumer>
      </ScrollView>
      <LocalControls />
    </>
  );
};

export default PinnedVideo;
