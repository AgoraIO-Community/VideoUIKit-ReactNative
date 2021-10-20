import React from 'react';
import {ScrollView, View} from 'react-native';
import RtcConfigure from './RTCConfigure';
import MaxVideoView from './Views/MaxVideoView';
import MinVideoView from './Views/MinVideoView';
import {MinUidConsumer} from './Contexts/MinUidContext';
import {MaxUidConsumer} from './Contexts/MaxUidContext';
import {PropsProvider, PropsInterface} from './Contexts/PropsContext';

import styles from './Style';
import LocalControls from './Controls/LocalControls';

// import console = require('console');

const AgoraUIKit: React.FC<PropsInterface> = (props) => {
  return (
    <PropsProvider value={props}>
      <View>
        <RtcConfigure>
          <MaxUidConsumer>
            {(maxUsers) => (
              <MaxVideoView user={maxUsers[0]} key={maxUsers[0].uid} />
            )}
          </MaxUidConsumer>

          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            style={styles.minContainer}>
            <MinUidConsumer>
              {(minUsers) =>
                minUsers.map((user) => (
                  <MinVideoView user={user} key={user.uid} />
                ))
              }
            </MinUidConsumer>
          </ScrollView>
          <LocalControls />
        </RtcConfigure>
      </View>
    </PropsProvider>
  );
};

export default AgoraUIKit;
