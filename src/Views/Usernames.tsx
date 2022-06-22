import React, {useContext} from 'react';
import RtmContext from '../Contexts/RtmContext';
import PropsContext, {UidInterface} from '../Contexts/PropsContext';
import {StyleSheet, Text} from 'react-native';

const Username: React.FC<{user: UidInterface; style?: React.CSSProperties}> = (
  props,
) => {
  const {usernames} = useContext(RtmContext);
  const {rtmProps, styleProps} = useContext(PropsContext);
  const {user} = props;

  return rtmProps?.displayUsername ? (
    <Text style={[styles.username, styleProps?.usernameText]}>
      {usernames[user.uid]}
    </Text>
  ) : (
    <React.Fragment />
  );
};

const styles = StyleSheet.create({
  username: {
    position: 'absolute',
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#007bffaa',
    color: '#fff',
    margin: 0,
    bottom: 0,
    right: 0,
    zIndex: 1,
  },
});

export default Username;
