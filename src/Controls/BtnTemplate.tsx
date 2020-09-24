import React, {useContext} from 'react';
import {
  TouchableOpacity,
  Image,
  StyleProp,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import PropsContext from './../PropsContext';
import styles from '../Style';
import icons, {IconsInterface} from './Icons';

interface BtnTemplateInterface {
  name: keyof IconsInterface;
  color?: string;
  onPress?: TouchableOpacityProps['onPress'];
  style?: StyleProp<ViewStyle>;
}

const BtnTemplate: React.FC<BtnTemplateInterface> = (props) => {
  const {styleProps} = useContext(PropsContext);
  const {BtnTemplateStyles, theme} = styleProps || {};

  return (
    <TouchableOpacity
      style={{
        ...styles.controlBtn,
        ...(BtnTemplateStyles as object),
        ...(props.style as object),
      }}
      onPress={props.onPress}>
      <Image
        style={{
          width: 42,
          height: 42,
          tintColor:
            props.name !== 'callEnd'
              ? theme || props.color || '#fff'
              : '#f97365',
        }}
        resizeMode={'contain'}
        source={{uri: icons[props.name]}}
      />
    </TouchableOpacity>
  );
};

export default BtnTemplate;
