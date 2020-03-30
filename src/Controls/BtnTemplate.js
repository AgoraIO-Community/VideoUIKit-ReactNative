import React, { useContext } from 'react'
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons'
import styles from './../Style'
import PropsContex from './../PropsContext'

function btnTemplate(props) {
    const { styleProps } = useContext(PropsContex);
    const { BtnStyles, theme } = styleProps || {};
    console.log("zz:",BtnStyles);
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