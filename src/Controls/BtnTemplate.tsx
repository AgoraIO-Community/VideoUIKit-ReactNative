import React, { useContext } from 'react';
import {
  Image,
  Platform,
  StyleProp,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import PropsContext, { IconsInterface } from '../Contexts/PropsContext';
import styles from '../Style';
import useImageDelay from '../hooks/useImageDelay';
import icons from './Icons';
import { Either } from './types';

interface BtnTemplateBasicInterface {
  color?: string;
  onPress?: TouchableOpacityProps['onPress'];
  style?: StyleProp<ViewStyle>;
  btnText?: string;
  disabled?: boolean;
}
interface BtnTemplateInterfaceWithName extends BtnTemplateBasicInterface {
  name?: keyof IconsInterface;
}
interface BtnTemplateInterfaceWithIcon extends BtnTemplateBasicInterface {
  icon?: any;
}
type BtnTemplateInterface = Either<
  BtnTemplateInterfaceWithIcon,
  BtnTemplateInterfaceWithName
>;

const BtnTemplate: React.FC<BtnTemplateInterface> = (props) => {
  const {disabled = false} = props;
  const {styleProps} = useContext(PropsContext);
  const {BtnTemplateStyles, theme, iconSize, customIcon, showButtonsLabel} = styleProps || {};

  const imageRef = React.useRef(null);

  // This fixes the tint issue in safari browser
  useImageDelay(imageRef, 10, '', props?.color || '');

  return (
    <TouchableOpacity
      style={styleProps?.BtnTemplateContainer}
      disabled={disabled}
      onPress={props.onPress}>
      <View
        style={[
          {...styles.controlBtn, ...(BtnTemplateStyles as object)},
          props.style as object,
        ]}>
        <Image
          ref={Platform.OS === 'web' ? imageRef : undefined}
          style={{
            width: iconSize || 25,
            height: iconSize || 25,
            opacity: disabled ? 0.4 : 1,
            tintColor: disabled ? 'grey' : props.color || theme || '#fff',
          }}
          resizeMode={'contain'}
          source={{
            uri: props.name
              ? customIcon?.[props.name]
                ? customIcon[props.name]
                : icons[props.name]
              : props.icon,
          }}
        />
      </View>
      {showButtonsLabel &&
      <Text
        style={{
          textAlign: 'center',
          marginTop: 5,
          color: disabled ? 'grey' : props.color || theme || '#fff',
          opacity: disabled ? 0.4 : 1,
        }}>
        {props.btnText}
      </Text>}
    </TouchableOpacity>
  );
};

export default BtnTemplate;
