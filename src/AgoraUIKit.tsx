import React from 'react';
import {ScrollView, View} from 'react-native';
import RtcConfigure from './RtcConfigure';
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
      <View style={{backgroundColor: '#000', flex: 1}}>
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
                  <MinVideoView showOverlay user={user} key={user.uid} />
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
