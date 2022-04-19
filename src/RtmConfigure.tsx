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
import {muteAudio} from './Controls/Local/LocalAudioMute';
import {muteVideo} from './Controls/Local/LocalVideoMute';
import {LocalContext} from './Contexts/LocalUserContext';
import {Platform} from 'react-native';
import {RtmClientEvents} from 'agora-react-native-rtm/lib/typescript/src/RtmEngine';

/**
 * React component that contains the RTM logic. It manages the usernames, remote mute requests and provides data to the children components by wrapping them with context providers.
 */
const RtmConfigure = (props: any) => {
  const {rtcProps, rtmProps} = useContext(PropsContext);
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
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
    console.log('Login to RTM');
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
    console.log('join RTM');
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
    setRtmStatus(rtmStatusEnum.initialising);
    localUid.current = String(rtcUidRef.current);
    await rtmClient.createInstance(rtcProps.appId);
    // not sure why this is here, fix
    // localuid can be
    // 0 -> rtcengine assigns
    // same as user rtcUid
    // user rtmUid
    // rtcProps.uid
    //   ? (localUid.current = String(rtcProps.uid))
    //   : (localUid.current = String(timeNow()));

    // rtmClient.on('error', (e) => {
    //   console.log('!error', e);
    // });

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

    /* handle RTM callbacks */
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
    setUsernames((p) => {
      return {...p, 'local': rtmProps?.username};
    });
    sendChannelMessage(createUserData());
  };

  const createUserData = () => {
    const userData: userDataType = {
      messageType: 'UserData',
      rtmId: String(rtmProps?.uid || rtcUidRef.current),
      rtcId: rtcUidRef.current as number,
      username: rtmProps?.username,
      role: rtcProps.role === ClientRole.Audience ? 1 : 0,
      uikit: {
        platform: Platform.OS,
        framework: 'reactnative',
        version: '0.1.0',
      },
      agora: {
        rtm: rtmVersion,
        rtc: rtcVersion,
      },
    };
    return userData;
  };

  const sendMuteRequest = (
    device: mutingDevice,
    rtcId: number,
    mute: boolean,
  ) => {
    const forced = rtmProps?.showPopUpBeforeRemoteMute === false;
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
      console.log('sendMuteRequest', rtcId, peerId);
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
    const messageObject: messageObjectType = JSON.parse(payload);
    console.log('handleReceivedMessage', messageObject, peerId);
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
  };

  const handleReceivedMuteMessage = (muteRequest: muteRequestType) => {
    console.log('gotMuteRequest', muteRequest);
    if (rtcUidRef.current === muteRequest.rtcId) {
      if (muteRequest.isForceful) {
        if (muteRequest.mute) {
          if (muteRequest.device === mutingDevice.microphone) {
            muteAudio(local, dispatch, RtcEngine);
          } else if (muteRequest.device === mutingDevice.camera) {
            muteVideo(local, dispatch, RtcEngine);
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
    const rawMessage = JSON.stringify(payload);
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
    const text = JSON.stringify(payload);
    const message: RtmMessage = {
      text: text,
    };
    try {
      await rtmClient.sendMessageToPeerV2(peerId, message, {});
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const end = async () => {
      console.log('end');
      await rtmClient?.leaveChannel(rtcProps.channel);
      await rtmClient?.logout();
      await rtmClient?.removeAllListeners();
    };

    if (rtcChannelJoined) {
      init();
      setLoggedIn(true);
    }
    return () => {
      if (rtcChannelJoined) {
        end();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

// const timeNow = () => new Date().getTime();

const rtmClient = new RtmClient();
let rtmVersion: string;
let rtcVersion: string;

RtmClient.getSdkVersion().then((version) => {
  rtmVersion = version;
});
RtcEngineSDK.getSdkVersion().then((version) => {
  rtcVersion = version;
});

export default RtmConfigure;
