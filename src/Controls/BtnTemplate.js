import React, { useContext } from 'react';
import { TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropsContex from './../PropsContext';
import styles from './../Style';

function btnTemplate(props) {
    const { styleProps } = useContext(PropsContex);
    const { BtnStyles, theme } = styleProps || {};
    
    return (
        <TouchableOpacity
            style={{ ...styles.controlBtn, ...BtnStyles, ...props.style }}
            onPress={props.onPress}
        >
            <Icon name={props.name} size={props.size || 20} color={theme || props.color || "#fff"} />
        </TouchableOpacity>
    )
}

export default btnTemplate; 