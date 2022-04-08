// fix localUid precedence, rtcuid, rtmuid, timenow, etc.

import React, {useState, useContext, useEffect, useRef} from 'react';
import RtmClient, {
  ConnectionChangeReason,
  RtmChannelMember,
  RtmConnectionState,
  RtmMessage,
} from 'agora-react-native-rtm';
import RtcEngineSDK from 'react-native-agora';
import PropsContext, {ClientRole} from './Contexts/PropsContext';
import {
  RtmProvider,
  muteRequest as muteRequestType,
  mutingDevice,
  rtmStatusEnum,
  userDataType,
  popUpStateEnum,
  messageObjectType,
} from './Contexts/RtmContext';
import RtcContext from './Contexts/RtcContext';
// import AgoraRTC, {UID} from 'agora-rtc-react';;
// import {LocalContext} from './LocalUserContext';;
import muteAudio from './Controls/Local/muteAudioFunction';
// import muteVideo from './Controls/Local/LocalVideoMute';
import {RtmClientEvents} from 'agora-react-native-rtm/lib/typescript/src/RtmEngine';
import {RtcUidProps} from 'react-native-agora/lib/typescript/src/common/RtcRenderView.native';
import {LocalContext} from './Contexts/LocalUserContext';

let rtmVersion: string;
let rtcVersion: string;
RtmClient.getSdkVersion().then((v) => {
  rtmVersion = v;
});
RtcEngineSDK.getSdkVersion().then((v) => {
  rtcVersion = v;
});
const rtmClient = new RtmClient();
const timeNow = () => new Date().getTime();
/**
 * React component that contains the RTM logic. It manages the usernames, remote mute requests and provides data to the children components by wrapping them with context providers.
 */
const RtmConfigure = (props: any) => {
  const {rtcProps, rtmProps} = useContext(PropsContext);
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  // let rtmClient: RtmClient | undefined;
  const timerValueRef: any = useRef(5);
  const localUid = useRef<string>('');
  const local = useContext(LocalContext);
  const {RtcEngine, dispatch} = useContext(RtcContext);
  const {rtcUidRef, rtcChannelJoined} = useContext(RtcContext);
  const {rtmCallbacks} = useContext(PropsContext);
  const [uidMap, setUidMap] = useState<Record<number, string>>({});
  const [usernames, setUsernames] = useState<Object>({});
  const [userDataMap, setUserDataMap] = useState<Object>({});
  const [popUpState, setPopUpState] = useState<popUpStateEnum>(
    popUpStateEnum.closed,
  );
  const [rtmStatus, setRtmStatus] = useState<rtmStatusEnum>(
    rtmStatusEnum.offline,
  );

  const login = async () => {
    const {tokenUrl} = rtcProps;
    console.log('login-------------------');
    if (tokenUrl) {
      try {
        const res = await fetch(
          tokenUrl + '/rtm/' + (rtmProps?.uid || localUid.current),
        );
        const data = await res.json();
        const serverToken = data.rtmToken;
        await rtmClient?.loginV2(
          rtmProps?.uid || String(localUid.current),
          serverToken,
        );
        timerValueRef.current = 5;
      } catch (error) {
        setTimeout(async () => {
          timerValueRef.current = timerValueRef.current + timerValueRef.current;
          login();
        }, timerValueRef.current * 1000);
      }
    } else {
      try {
        console.log('!myRtmUid', rtmProps?.uid || String(localUid.current));
        await rtmClient?.loginV2(
          rtmProps?.uid || String(localUid.current),
          // rtmProps?.token || null,
        );
        timerValueRef.current = 5;
      } catch (error) {
        setTimeout(async () => {
          timerValueRef.current = timerValueRef.current + timerValueRef.current;
          login();
        }, timerValueRef.current * 1000);
      }
    }
  };

  const joinChannel = async () => {
    console.log('join-------------------');
    await rtcUidRef;
    try {
      await rtmClient?.joinChannel(rtcProps.channel);
      timerValueRef.current = 5;
    } catch (error) {
      setTimeout(async () => {
        timerValueRef.current = timerValueRef.current + timerValueRef.current;
        joinChannel();
      }, timerValueRef.current * 1000);
    }
  };

  const init = async () => {
    console.log('init-------------------');
    setRtmStatus(rtmStatusEnum.initialising);
    localUid.current = String(rtcUidRef.current);
    // rtmProps?.uid
    //   ? (localUid.current = String(rtmProps.uid))
    //   :
    // rtmClient = new RtmClient();
    await rtmClient.createInstance(rtcProps.appId);
    // not sure why this is here, fix
    // localuid can be
    // 0 -> rtcengine assigns
    // same as user rtcUid
    // user rtmUid
    // rtcProps.uid
    //   ? (localUid.current = String(rtcProps.uid))
    //   : (localUid.current = String(timeNow()));

    rtmClient.on('error', (e) => {
      console.log('!error', e);
    });

    rtmClient.addListener('ConnectionStateChanged', (state, reason) => {
      console.log(
        '!ConnectionStateChanged',
        RtmConnectionState[state],
        ConnectionChangeReason[reason],
      );
    });

    rtmClient.addListener('TokenExpired', async () => {
      const {tokenUrl} = rtcProps;
      console.log('token expired - renewing');
      if (tokenUrl) {
        try {
          const res = await fetch(
            tokenUrl + '/rtm/' + (rtmProps?.uid || localUid.current),
          );
          const data = await res.json();
          const serverToken = data.rtmToken;
          await rtmClient?.renewToken(serverToken);
          timerValueRef.current = 5;
        } catch (error) {
          console.error('TokenExpiredError', error);
        }
      }
    });

    rtmClient.addListener('MessageReceived', (message, peerId) => {
      console.log('MessageReceived', peerId);
      handleReceivedMessage(message as RtmMessage, peerId);
    });

    rtmClient.addListener('ChannelMessageReceived', (message, member) => {
      console.log('ChannelMessageReceived', member.userId);
      handleReceivedMessage(message as RtmMessage, member.userId);
    });

    rtmClient.addListener('ChannelMemberJoined', async (peerId) => {
      console.log('ChannelMemberJoined', peerId.userId);
      await sendPeerMessage(createUserData(), peerId.userId);
    });

    // channel.on('MemberCountUpdated', async (count) => {
    //   console.log('RTM-MemberCountUpdated: ', count);
    // });

    // handle RTM callbacks
    if (rtmCallbacks) {
      Object.keys(rtmCallbacks.channel).map((callback) => {
        if (rtmCallbacks.channel) {
          rtmClient?.addListener(
            callback as keyof RtmClientEvents,
            rtmCallbacks[callback],
          );
        }
      });
    }

    if (rtcProps.tokenUrl) {
      const {tokenUrl, uid} = rtcProps;
      rtmClient.addListener('TokenExpired', async () => {
        console.log('token expired');
        const res = await fetch(tokenUrl + '/rtm/' + (uid || 0) + '/');
        const data = await res.json();
        const token = data.rtmToken;
        rtmClient?.renewToken(token);
      });
    }

    setRtmStatus(rtmStatusEnum.loggingIn);
    await login();
    setRtmStatus(rtmStatusEnum.loggedIn);
    await joinChannel();
    setRtmStatus(rtmStatusEnum.connected);
    // console.log('!rtcUid', rtcUid, channelJoined)
    setUsernames((p) => {
      return {...p, 0: rtmProps?.username};
    });
    sendChannelMessage(createUserData());
  };

  const createUserData = () => {
    return {
      messageType: 'UserData',
      rtmId: rtmProps?.uid || rtcUidRef.current,
      rtcId: rtcUidRef.current,
      username: rtmProps?.username,
      role: rtcProps.role === ClientRole.Audience ? 1 : 0,
      uikit: {
        platform: 'web',
        framework: 'react',
        version: '0.1.0',
      },
      agora: {
        // fix async
        rtm: rtmVersion,
        rtc: rtcVersion,
      },
    } as userDataType;
  };

  const sendMuteRequest = (
    device: mutingDevice,
    rtcId: RtcUidProps['uid'],
    mute: boolean,
  ) => {
    const forced = true;
    // rtmProps?.showPopUpBeforeRemoteMute === false;
    // trying replcae -> fix
    const payload: muteRequestType = {
      messageType: 'MuteRequest',
      device,
      rtcId,
      mute,
      isForceful: forced,
    };
    const peerId = uidMap[rtcId];
    if (forced && !mute) {
      console.log('cannot send force unmute request');
    } else if (peerId) {
      console.log('!sendMuteRequest', rtcId, peerId);
      sendPeerMessage(payload, peerId);
    } else {
      console.log('peer not found');
    }
  };

  const handleReceivedMessage = (
    message: RtmMessage,
    peerId: RtmChannelMember['userId'],
  ) => {
    const payload = (message as RtmMessage).text;
    const messageObject: messageObjectType = parseJson(payload);
    console.log('!handleReceivedMessage', messageObject, peerId);
    switch (messageObject.messageType) {
      case 'UserData':
        handleReceivedUserDataMessage(messageObject);
        break;
      case 'MuteRequest':
        handleReceivedMuteMessage(messageObject);
        break;
      case 'RtmDataRequest':
        switch (messageObject.type) {
          case 'ping':
            handlePing(peerId);
            break;
          case 'userData':
            handleUserDataRequest(peerId);
            break;
          default:
            console.log(peerId);
        }
        break;
      default:
        console.log('unknown message type');
    }
  };

  const handleReceivedUserDataMessage = (userData: userDataType) => {
    setUidMap((p) => {
      return {...p, [userData.rtcId]: userData.rtmId};
    });
    setUsernames((p) => {
      return {...p, [userData.rtcId]: userData.username};
    });
    setUserDataMap((p) => {
      return {...p, [userData.rtmId]: userData};
    });
    // console.log('userData', userData, userDataMap, uidMap)
  };

  const handleReceivedMuteMessage = (muteRequest: muteRequestType) => {
    console.log('!gotMuteRequest', muteRequest);
    if (rtcUidRef.current === muteRequest.rtcId) {
      if (muteRequest.isForceful) {
        if (muteRequest.mute) {
          if (muteRequest.device === mutingDevice.microphone) {
            console.log('!muteAudio', local);
            muteAudio(local, dispatch, RtcEngine);
            // } else if (muteRequest.device === mutingDevice.camera) {
            //   localVideoTrack && muteVideo(local, dispatch, localVideoTrack);
          }
        } else {
          console.error('cannot force unmute');
        }
      } else {
        if (muteRequest.device === mutingDevice.microphone) {
          if (muteRequest.mute) {
            setPopUpState(popUpStateEnum.muteMic);
          } else {
            setPopUpState(popUpStateEnum.unmuteMic);
          }
        } else if (muteRequest.device === mutingDevice.camera) {
          if (muteRequest.mute) {
            setPopUpState(popUpStateEnum.muteCamera);
          } else {
            setPopUpState(popUpStateEnum.unmuteCamera);
          }
        }
      }
    }
  };

  const handlePing = (peerId: RtmChannelMember['userId']) => {
    sendPeerMessage({messageType: 'RtmDataRequest', type: 'pong'}, peerId);
  };

  const handleUserDataRequest = (peerId: RtmChannelMember['userId']) => {
    sendPeerMessage(createUserData(), peerId);
  };

  const sendChannelMessage = async (payload: messageObjectType) => {
    const rawMessage = createJson(payload);
    const message: RtmMessage = {
      text: rawMessage,
    };
    try {
      await rtmClient?.sendMessage(rtcProps.channel, message, {});
    } catch (e) {
      console.log(e);
    }
  };

  const sendPeerMessage = async (
    payload: messageObjectType,
    peerId: RtmChannelMember['userId'],
  ) => {
    await testz();
    const text = createJson(payload);
    const message: RtmMessage = {
      text: text,
    };
    console.log('!sendPM', peerId, 'myId', localUid.current);
    try {
      await rtmClient.sendMessageToPeerV2(peerId, message, {});
      // await rtmClient.sendMessage(rtcProps.channel, message, {});
    } catch (e) {
      console.log(e);
    }
  };

  const testz = async () => {
    let d = await rtmClient.getMembers(rtcProps.channel);
    console.log(d);
  };

  const end = async () => {
    console.log('end----------------------');
    // await rtmClient?.leaveChannel(rtcProps.channel);
    // await rtmClient?.logout();
    // await rtmClient?.removeAllListeners();
  };

  useEffect(() => {
    // if RTC has joined channel then init
    if (rtcChannelJoined) {
      init();
      setLoggedIn(true);
    }
    return () => {
      if (rtcChannelJoined) {
        end();
      }
    };
  }, [rtcProps.channel, rtcProps.appId, rtcChannelJoined]);

  return (
    <RtmProvider
      value={{
        rtmStatus,
        sendPeerMessage,
        sendChannelMessage,
        sendMuteRequest,
        rtmClient,
        uidMap,
        usernames,
        userDataMap,
        popUpState,
        setPopUpState,
      }}>
      {isLoggedIn ? props.children : <React.Fragment />}
    </RtmProvider>
  );
};

/**
 * Create an RTM raw message from any serilizable JS Object, decode using the {@link parseJson} function
 * @param msg message object
 * @returns Uint8Array
 */
export const createJson = (msg: any) => {
  return JSON.stringify(msg);
};
/**
 * Decode the received RTM message or message created using {@link createJson}
 * @param data encoded raw RTM message
 * @returns JS Object
 */
export const parseJson = (data: string) => {
  return JSON.parse(data);
};

export default RtmConfigure;
