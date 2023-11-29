import React, {useContext} from 'react';
import {
  TouchableOpacity,
  Image,
  StyleProp,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  Text,
  View,
  Platform,
  ImageStyle,
} from 'react-native';
import PropsContext from '../Contexts/PropsContext';
import styles from '../Style';
import icons, {IconsInterface} from './Icons';
import useImageDelay from '../hooks/useImageDelay';
import {Either} from './types';

interface BtnTemplateBasicInterface {
  onPress?: TouchableOpacityProps['onPress'];
  style?: StyleProp<ViewStyle>;
  styleText?: TextStyle;
  styleIcon?: ImageStyle;
  btnText?: string;
  disabled?: boolean;
}
interface BtnTemplateInterfaceWithName extends BtnTemplateBasicInterface {
  //@ts-ignore
  name?: keyof IconsInterface;
}
interface BtnTemplateInterfaceWithIcon extends BtnTemplateBasicInterface {
  icon?: any;
}
export type BtnTemplateInterface = Either<
  BtnTemplateInterfaceWithIcon,
  BtnTemplateInterfaceWithName
>;

const BtnTemplate: React.FC<BtnTemplateInterface> = (props) => {
  const {disabled = false} = props;
  const {styleProps} = useContext(PropsContext);
  const {BtnTemplateStyles, theme} = styleProps || {};

  const imageRef = React.useRef(null);

  // This fixes the tint issue in safari browser
  // useImageDelay(imageRef, 10, '', props?.color || '');

  return (
    <TouchableOpacity
      style={props.style}
      disabled={disabled}
      onPress={props.onPress}>
      <Image
        ref={Platform.OS === 'web' ? imageRef : undefined}
        style={[
          {
            width: '100%',
            height: '100%',
            //opacity: disabled ? 0.4 : 1,
            //In new design all icons comes with filled color. so don't apply the tintColor
            //tintColor: disabled ? 'grey' : props.color || theme || '#fff',
          },
          props?.styleIcon,
        ]}
        resizeMode={'contain'}
        source={{
          uri:
            props?.name && icons[props.name] ? icons[props.name] : props.icon,
        }}
      />
      <Text
        style={[
          {
            textAlign: 'center',
            marginTop: 5,
            //color: disabled ? 'grey' : props.color || theme || '#fff',
            //opacity: disabled ? 0.4 : 1,
          },
          props?.styleText,
        ]}>
        {props.btnText}
      </Text>
    </TouchableOpacity>
  );
};

export default BtnTemplate;
