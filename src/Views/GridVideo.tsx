import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import MaxVideoView from './MaxVideoView';
import MinUidContext from '../Contexts/MinUidContext';
import MaxUidContext from '../Contexts/MaxUidContext';
import PropsContext, {ClientRole} from '../Contexts/PropsContext';

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

const GridVideo: React.FC = () => {
  const max = useContext(MaxUidContext);
  const min = useContext(MinUidContext);
  const {rtcProps, styleProps} = useContext(PropsContext);
  const users =
    rtcProps.role === ClientRole.Audience
      ? [...max, ...min].filter((user) => user.uid !== 'local')
      : [...max, ...min];
  let onLayout = (e: any) => {
    setDim([
      e.nativeEvent.layout.width,
      e.nativeEvent.layout.height,
      e.nativeEvent.layout.width > e.nativeEvent.layout.height,
    ]);
  };
  const [dim, setDim]: [
    [number, number, boolean],
    Dispatch<SetStateAction<[number, number, boolean]>>,
  ] = useState([
    Dimensions.get('window').width,
    Dimensions.get('window').height,
    Dimensions.get('window').width > Dimensions.get('window').height,
  ]);
  const isDesktop = dim[0] > dim[1] + 100;
  let {matrix, dims} = useMemo(
    () => layout(users.length, isDesktop),
    [users.length, isDesktop],
  );
  return (
    <View style={style.full} onLayout={onLayout}>
      {matrix.map((r, ridx) => (
        <View style={style.gridRow} key={ridx}>
          {r.map((c, cidx) => (
            <View style={style.col} key={cidx}>
              <View
                style={{
                  ...style.gridVideoContainerInner,
                  ...(styleProps?.gridVideoView as object),
                }}>
                {rtcProps.role === ClientRole.Audience &&
                users[ridx * dims.c + cidx].uid === 'local' ? null : (
                  <MaxVideoView
                    user={users[ridx * dims.c + cidx]}
                    key={users[ridx * dims.c + cidx].uid}
                  />
                )}
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
    // flex: 1,
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
