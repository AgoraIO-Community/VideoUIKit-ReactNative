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
import {Image, StyleProp, ViewStyle} from 'react-native';
import icons, {IconsInterface} from './Icons';
import PropsContext from './../Contexts/PropsContext';
import useImageDelay from './../../../src/hooks/useImageDelay';
import isSafariBrowser from '../../../src/utils/isSafariBrowser';

interface ImageIconInterface {
  name: keyof IconsInterface;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

const ImageIcon: React.FC<ImageIconInterface> = (props) => {
  const {styleProps} = useContext(PropsContext);
  const {theme} = styleProps || {};
  const imageRef = React.useRef(null);

  if (isSafariBrowser()) {
    // This hook renders the image after a delay to fix
    // tint issue in safari browser
    useImageDelay(imageRef, 10, props.name);
  }

  return (
    <Image
      ref={imageRef}
      style={[
        {
          width: '100%',
          height: '100%',
          tintColor: props.color || theme || '#fff'              
        },
        props.style as object,
      ]}
      resizeMode={'contain'}
      source={{uri: icons[props.name]}}
    />
  );
};

export default ImageIcon;
