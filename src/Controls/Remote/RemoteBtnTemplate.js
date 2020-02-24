import React, { useContext } from 'react'
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons'
import styles from '../../Style'
import PropsContex from '../../PropsContext'

function RemoteBtnTemplate(props) {
    const { styleProps } = useContext(PropsContex);
    const { remoteControlStyles, theme } = styleProps || {};

    return (
        <TouchableOpacity
            style={{ ...styles.remoteControlBtn, ...remoteControlStyles, ...props.style }}
            onPress={props.onPress}
        >
            <Icon name={props.name} size={props.size || 20} color={theme || props.color || "#007aff"} />
        </TouchableOpacity>
    )
}

export default RemoteBtnTemplate; 