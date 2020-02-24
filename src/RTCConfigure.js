import React, { useState, useEffect, useReducer, useContext } from 'react';
import { RtcEngine } from 'react-native-agora';
import { NativeModules } from 'react-native';
import requestCameraAndAudioPermission from './permission';
import { RtcProvider } from './RtcContext'
import PropsContext from './PropsContext'
import { MinUidProvider } from './MinUidContext'
import { MaxUidProvider } from './MaxUidContext'

const initialState = {
    min: [],
    max: [{
        uid: 'local',
        audio: true,
        video: true
    }]
}

function RtcConfigure(props) {
    // const [uids, setUids] = useState([]);
    const [ready, setReady] = useState(false);
    let joinRes;
    let canJoin = new Promise((res, rej) => joinRes = res);
    const { callbacks, rtcProps } = useContext(PropsContext)
    const { videoEncoderConfig } = rtcProps || {};
    const {
        width,
        height,
        bitrate,
        frameRate,
        orientationMode
    } = videoEncoderConfig || {};

    const reducer = (state, action) => {

        let stateUpdate = {}, uids = [...state.max, ...state.min].map(u => u.uid);

        switch (action.type) {
            case 'onUserJoined':
                if (uids.indexOf(action.value.user.uid) === -1) {                    //If new user has joined

                    let minUpdate = [...state.min, { uid: action.value.user.uid, audio: true, video: true }];           //By default add to minimized

                    if (minUpdate.length === 1 && state.max[0].uid === 'local') {  //Only one remote
                        //Swap max and min
                        stateUpdate = {
                            max: minUpdate,
                            min: state.max
                        }
                    }
                    else {                                                  //More than one remote
                        stateUpdate = {
                            min: minUpdate
                        }
                    }

                    console.log("new user joined!\n", state, stateUpdate);
                }
                break;
            case 'onUserOffline':
                if (state.max[0].uid === action.value.user.uid) {           //If max has the remote video
                    let minUpdate = [...state.min];
                    stateUpdate = {
                        max: [minUpdate.pop()],
                        min: minUpdate
                    }
                }
                else {
                    stateUpdate = {
                        min: state.min.filter(user => user.uid !== action.value.user.uid)
                    }
                }
                break;
            case 'onSwapVideo':
                stateUpdate = swapVideo(state, action.value.user);
                break;
            case 'onUserMuteRemoteAudio':
                const audioMute = (user) => {
                    if (user.uid === action.value.user.uid)
                        user.audio = !action.value.muted;
                    return user
                };
                stateUpdate = {
                    min: state.min.map(audioMute),
                    max: state.max.map(audioMute)
                }
                break;
            case 'onUserMuteRemoteVideo':
                const videoMute = (user) => {
                    if (user.uid === action.value.user.uid)
                        user.video = !action.value.muted;
                    return user
                };
                stateUpdate = {
                    min: state.min.map(videoMute),
                    max: state.max.map(videoMute)
                }
                break;

        }

        // Handle event listeners

        if (callbacks[action.type]) {
            callbacks[action.type](action.value);
            console.log('callback executed');
        }
        else {
            console.log('callback not found', props)
        }


        console.log(state, action, stateUpdate);

        return {
            ...state,
            ...stateUpdate
        };
    }

    const swapVideo = (state, ele) => {
        let newState = {};
        newState.min = state.min.filter(e => e !== ele);
        if (state.max[0].uid === 'local')
            newState.min.unshift((state.max[0]));
        else
            newState.min.push((state.max[0]));
        newState.max = [ele];

        return newState;
    }

    const [uidState, dispatch] = useReducer(reducer, initialState);


    useEffect(() => {
        const { Agora } = NativeModules;
        const {
            FPS30,
            AudioProfileDefault,
            AudioScenarioDefault,
            Adaptative
        } = Agora;

        //RTC configuration

        const config = {
            appid: rtcProps.appid,                          //Enter the App ID generated from the Agora Website
            channelProfile: rtcProps.channelProfile || 0,   //Set channel profile as 0 for RTC
            videoEncoderConfig: {                           //Set Video feed encoder settings
                width: width || 720,
                height: height || 1080,
                bitrate: bitrate || 1,
                frameRate: frameRate || FPS30,
                orientationMode: orientationMode || Adaptative,
            },
            audioProfile: AudioProfileDefault,
            audioScenario: AudioScenarioDefault,
        };

        RtcEngine.on('userJoined', (user) => {                  //Get currrent peer IDs
            dispatch({ type: 'onUserJoined', value: { user } });
        });

        RtcEngine.on('userOffline', (user) => {                             //If user leaves
            dispatch({ type: 'onUserOffline', value: { user } });
        });

        async function init() {
            if (Platform.OS === 'android') {                    //Request required permissions from Android
                let res = await requestCameraAndAudioPermission();
            }
            RtcEngine.init(config);
            RtcEngine.enableVideo();
            RtcEngine.startPreview();
            joinRes(true);
            setReady(true);
        }
        init();

        return () => {
            RtcEngine.destroy();
        }
    }, [rtcProps.appid, videoEncoderConfig, rtcProps.channelProfile])

    // Dynamically switches channel when channel prop changes
    useEffect(() => {
        async function join() {
            await canJoin;
            RtcEngine.joinChannel(rtcProps.channel, rtcProps.uid, rtcProps.token);
        }
        join();
        return () => canJoin = RtcEngine.leaveChannel().catch(err => console.log(err));
    }, [rtcProps.channel, rtcProps.uid, rtcProps.token])

    return (
        <RtcProvider value={{ RtcEngine, dispatch }}>

            <MaxUidProvider value={uidState.max}>
                <MinUidProvider value={uidState.min}>
                    {
                        // Render children once RTCEngine has been initialized
                        ready ? props.children : <></>
                    }
                </MinUidProvider>
            </MaxUidProvider>

        </RtcProvider>
    )
}

export default RtcConfigure;