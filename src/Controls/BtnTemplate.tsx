import React, {useContext} from 'react';
import {
  TouchableOpacity,
  Image,
  StyleProp,
  TouchableOpacityProps,
  ViewStyle,
  Text,
  View,
} from 'react-native';
import PropsContext from '../Contexts/PropsContext';
import styles from '../Style';
import icons, {IconsInterface} from './Icons';

interface BtnTemplateInterface {
  name: keyof IconsInterface;
  color?: string;
  onPress?: TouchableOpacityProps['onPress'];
  style?: StyleProp<ViewStyle>;
  btnText?: string;
}

const BtnTemplate: React.FC<BtnTemplateInterface> = (props) => {
  const {styleProps} = useContext(PropsContext);
  const {BtnTemplateStyles, theme} = styleProps || {};

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View
        style={{
          ...styles.controlBtn,
          ...(BtnTemplateStyles as object),
          ...(props.style as object),
        }}>
        <Image
          style={{
            width: '100%',
            height: '100%',
            tintColor: theme || props.color || '#fff'
          }}
          resizeMode={'contain'}
          source={{uri: icons[props.name]}}
        />
      </View>
      <Text
        style={{
          textAlign: 'center',
          marginTop: 5,
          color: theme || props.color || '#fff'
        }}>
        {props.btnText}
      </Text>
    </TouchableOpacity>
  );
};

export default BtnTemplate;
