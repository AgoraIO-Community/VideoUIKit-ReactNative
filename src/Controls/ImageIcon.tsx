/*
********************************************
 Copyright © 2021 Agora Lab, Inc., all rights reserved.
 AppBuilder and all associated components, source code, APIs, services, and documentation 
 (the “Materials”) are owned by Agora Lab, Inc. and its licensors. The Materials may not be 
 accessed, used, modified, or distributed for any purpose without a license from Agora Lab, Inc.  
 Use without a license or in violation of any license terms and conditions (including use for 
 any purpose competitive to Agora Lab, Inc.’s business) is strictly prohibited. For more 
 information visit https://appbuilder.agora.io. 
*********************************************
*/
import React, {useContext} from 'react';
import {Image, Platform, StyleProp, ViewStyle} from 'react-native';
import icons from './Icons';
import PropsContext, {IconsInterface} from './../Contexts/PropsContext';
import useImageDelay from '../hooks/useImageDelay';
import {Either} from './types';

interface BaseInterface {
  color?: string;
  style?: StyleProp<ViewStyle>;
}

interface BaseInterfaceWithName extends BaseInterface {
  name?: keyof IconsInterface;
}
interface BaseInterfaceWithIcon extends BaseInterface {
  icon?: any;
}

type ImageIconInterface = Either<BaseInterfaceWithName, BaseInterfaceWithIcon>;

const ImageIcon: React.FC<ImageIconInterface> = (props) => {
  const {styleProps} = useContext(PropsContext);
  const {theme} = styleProps || {};
  const imageRef = React.useRef(null);

  useImageDelay(imageRef, 10, props?.name || '', props?.color);

  return (
    <Image
      ref={Platform.OS === 'web' ? imageRef : undefined}
      style={[
        {
          width: '100%',
          height: '100%',
          tintColor: props.color || theme || '#fff',
        },
        props.style as object,
      ]}
      resizeMode={'contain'}
      source={{uri: props.name ? icons[props.name] : props.icon}}
    />
  );
};

export default ImageIcon;
