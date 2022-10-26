import React from 'react';
import {ScrollView, View} from 'react-native';
import RtcConfigure from './RtcConfigure';
import MaxVideoView from './Views/MaxVideoView';
import MinVideoView from './Views/MinVideoView';
import {RenderConsumer} from './Contexts/RenderContext';
import {PropsProvider, PropsInterface} from './Contexts/PropsContext';

import styles from './Style';
import LocalControls from './Controls/LocalControls';

// import console = require('console');

const AgoraUIKit: React.FC<PropsInterface> = (props) => {
  return (
    <PropsProvider value={props}>
      <View style={{backgroundColor: '#000', flex: 1}}>
        <RtcConfigure>
          <RenderConsumer>
            {({renderList, activeUids}) => {
              const [maxUid, ...minUids] = activeUids;
              return (
                <>
                  <MaxVideoView user={renderList[maxUid]} key={maxUid} />
                  <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    style={styles.minContainer}>
                    {minUids.map((minUid) => (
                      <MinVideoView
                        showOverlay
                        user={renderList[minUid]}
                        key={minUid}
                      />
                    ))}
                  </ScrollView>
                </>
              );
            }}
          </RenderConsumer>
          <LocalControls />
        </RtcConfigure>
      </View>
    </PropsProvider>
  );
};

export default AgoraUIKit;
