/* eslint-disable prettier/prettier */

import { StyleSheet, Dimensions } from 'react-native';

let dimensions = {                                //get dimensions of the device to use in view styles
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
};

export default StyleSheet.create({
    max: {
        flex: 1,
    },
    buttonHolder: {
        height: 100,
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    button: {
        paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#0093E9', borderRadius: 25,
    },
    buttonText: {
        color: '#fff',
    },
    fullView: {
        width: dimensions.width, height: dimensions.height
    },
    minView: {
        width: 240,
        height: 135
    },
    minContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        padding: 0,
        margin: 0,
        width: dimensions.width
    },
    Controls: {
        position: 'absolute',
        bottom: 70,
        left: 0,
        width: dimensions.width,
        height: 70,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    minOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'black',
        opacity: 0.7,
    },
    minCloseBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        width: 46,
        height: 46,
        borderRadius: 23,
        position: 'absolute',
        right: 5,
        top: 5
    },
    remoteControlBtn: {
        width: 46,
        height: 46,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    leftRemoteBtn: {
        borderTopLeftRadius: 23,
        borderBottomLeftRadius: 23,
        borderRightWidth: 2 * StyleSheet.hairlineWidth,
        borderRightColor: '#007aff'
    },
    rightRemoteBtn: {
        borderTopRightRadius: 23,
        borderBottomRightRadius: 23,
        borderLeftWidth: 2 * StyleSheet.hairlineWidth,
        borderLeftColor: '#007aff'
    }
});
