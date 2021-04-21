import React, {useContext, useMemo, useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import MaxVideoView from './MaxVideoView';
import MinUidContext from './MinUidContext';
import MaxUidContext from './MaxUidContext';
import PropsContext, {mode, role} from './PropsContext';

const layout = (len: number, isDesktop: boolean = true) => {
  console.log('layout');
  const rows = Math.round(Math.sqrt(len));
  const cols = Math.ceil(len / rows);
  let [r, c] = isDesktop ? [rows, cols] : [cols, rows];
  return {
    matrix:
      len > 0
        ? [
            ...Array(r - 1)
              .fill(null)
              .map(() => Array(c).fill('X')),
            Array(len - (r - 1) * c).fill('X'),
          ]
        : [],
    dims: {r, c},
  };
};

const GridVideo = () => {
  console.log('re render grid');
  const max = useContext(MaxUidContext);
  const min = useContext(MinUidContext);
  const {rtcProps} = useContext(PropsContext);
  const users =
    rtcProps.role === role.Audience
      ? [...max, ...min].filter((user) => user.uid !== 'local')
      : [...max, ...min];
  let onLayout = (e: any) => {
    setDim([e.nativeEvent.layout.width, e.nativeEvent.layout.height]);
  };
  const [dim, setDim] = useState([
    Dimensions.get('window').width,
    Dimensions.get('window').height,
    Dimensions.get('window').width > Dimensions.get('window').height,
  ]);
  const isDesktop = dim[0] > dim[1] + 100;
  let {matrix, dims} = useMemo(() => layout(users.length, isDesktop), [
    users.length,
    isDesktop,
  ]);
  return (
    <View style={style.full} onLayout={onLayout}>
      {matrix.map((r, ridx) => (
        <View style={style.gridRow} key={ridx}>
          {r.map((c, cidx) => (
            <View style={style.col} key={cidx}>
              <View style={style.gridVideoContainerInner}>
                {rtcProps.role === role.Audience &&
                users[ridx * dims.c + cidx].uid === 'local' ? null : (
                  <MaxVideoView
                    user={users[ridx * dims.c + cidx]}
                    key={users[ridx * dims.c + cidx].uid}
                  />
                )}
                {/* <View
                  style={{
                    marginTop: -25,
                    backgroundColor: '#ffffffbb',
                    alignSelf: 'flex-start',
                    paddingHorizontal: 8,
                    height: 25,
                  }}>
                  <Text
                    textBreakStrategy={'simple'}
                    style={{
                      color: '#333',
                      lineHeight: 25,
                      fontWeight: '700',
                      width: '100%',
                      alignSelf: 'stretch',
                      textAlign: 'center',
                    }}>
                    {users[ridx * dims.c + cidx].uid}
                  </Text>
                </View> */}
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const style = StyleSheet.create({
  full: {
    width: '100%',
    height: '100%',
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  gridVideoContainerInner: {
    // borderColor: '#fff',
    // borderWidth:2,
    flex: 1,
    margin: 1,
  },
  col: {
    flex: 1,
    marginHorizontal: 'auto',
  },
});

export default GridVideo;
