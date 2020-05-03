import React, { useContext } from 'react';
import { TouchableOpacity, Image } from "react-native";
import PropsContex from './../PropsContext';
import styles from './../Style';
import icons from './Icons';
function btnTemplate(props) {
    const { styleProps } = useContext(PropsContex);
    const { BtnStyles, theme } = styleProps || {};
    
    return (
        <TouchableOpacity
            style={{ ...styles.controlBtn, ...BtnStyles, ...props.style }}
            onPress={props.onPress}
        >
            <Image style={{width: 25, height: 25}} source={{uri: icons[props.name], isStatic: true}} tintColor={theme || props.color || "#fff"} />
        </TouchableOpacity>
    )
}

export default btnTemplate; 