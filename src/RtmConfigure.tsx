import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  PropsWithChildren,
} from 'react';
import RtmClient, {
  ConnectionChangeReason,
  RtmChannelMember,
  RtmConnectionState,
  RtmMessage,
} from 'agora-react-native-rtm';
import PropsContext from './Contexts/PropsContext';
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
import RtmEngine from 'agora-react-native-rtm';
import {RtmClientEvents} from 'agora-react-native-rtm/src/RtmEngine';
import {ClientRoleType} from 'react-native-agora';
import RTMEngine from './RTMEngine';

/**
 * React component that contains the RTM logic. It manages the usernames, remote mute requests and provides data to the children components by wrapping them with context providers.
 */
const RtmConfigure: React.FC<PropsWithChildren> = (props) => {
  const rtmEngineRef = useRef<RtmEngine>();
  const local = useContext(LocalContext);
  const {rtcProps, rtmProps, rtmCallbacks} = useContext(PropsContext);
  const {RtcEngine, dispatch, rtcUidRef} = useContext(RtcContext);
  // const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  const [uidMap, setUidMap] = useState<Record<number, string>>({});
  const [usernames, setUsernames] = useState<Record<string, string> | {}>({});
  const [userDataMap, setUserDataMap] = useState<Object>({});
  const [popUpState, setPopUpState] = useState<popUpStateEnum>(
    popUpStateEnum.closed,
  );
  const [rtmStatus, setRtmStatus] = useState<rtmStatusEnum>(
    rtmStatusEnum.offline,
  );
  // const localUid = useRef<string>('');
  const rtcVersion = RtcEngine.getVersion().version;
  const [isLogin, setLogin] = useState<boolean>(false);

  const login = async () => {
    const {tokenUrl} = rtcProps;
    console.log('Login to RTM');
    if (tokenUrl) {
      try {
        const res = await fetch(
          tokenUrl + '/rtm/' + (rtmProps?.uid || String(rtcUidRef.current)),
        );
        const data = await res.json();
        const serverToken = data.rtmToken;
        await rtmEngineRef.current?.loginV2(
          rtmProps?.uid || String(rtcUidRef.current),
          serverToken,
        );
      } catch (error) {
        console.log('login error tokenUrl', error);
      }
    } else {
      try {
        await rtmEngineRef.current?.loginV2(
          rtmProps?.uid || String(rtcUidRef.current),
        );
      } catch (error) {
        console.log('login error', error);
      }
    }
    setRtmStatus(rtmStatusEnum.loggedIn);
  };

  const joinChannel = async () => {
    console.log('join RTM channel', rtcProps.channel);
    try {
      await rtmEngineRef.current?.joinChannel(rtcProps.channel);
    } catch (error) {
      console.log('joinChannelError:', error);
    }

    setUsernames((p) => {
      return {...p, ['local']: rtmProps?.username};
    });
    sendChannelMessage(createUserData());
    setLogin(true);
  };

  const init = async () => {
    setRtmStatus(rtmStatusEnum.initialising);
    rtmEngineRef.current = RTMEngine.getInstance(rtcProps.appId).engine;
    rtmEngineRef.current.addListener(
      'ConnectionStateChanged',
      (state, reason) => {
        console.log(
          'ConnectionStateChanged',
          RtmConnectionState[state],
          ConnectionChangeReason[reason],
        );
      },
    );

    rtmEngineRef.current.addListener('TokenExpired', async () => {
      const {tokenUrl} = rtcProps;
      console.log('token expired - renewing');
      if (tokenUrl) {
        try {
          const res = await fetch(
            tokenUrl + '/rtm/' + (rtmProps?.uid || String(rtcUidRef.current)),
          );
          const data = await res.json();
          const serverToken = data.rtmToken;
          await rtmEngineRef.current?.renewToken(serverToken);
        } catch (error) {
          console.error('TokenExpiredError', error);
        }
      }
    });

    rtmEngineRef.current.addListener('MessageReceived', (message, peerId) => {
      // console.log('MessageReceived', peerId);
      handleReceivedMessage(message as RtmMessage, peerId);
    });

    rtmEngineRef.current.addListener(
      'ChannelMessageReceived',
      (message, member) => {
        // console.log('ChannelMessageReceived', member.userId);
        handleReceivedMessage(message as RtmMessage, member.userId);
      },
    );

    rtmEngineRef.current.addListener('ChannelMemberJoined', async (peerId) => {
      // console.log('ChannelMemberJoined', peerId.userId);
      await sendPeerMessage(createUserData(), peerId.userId);
    });

    /* handle RTM callbacks */
    if (rtmCallbacks) {
      Object.keys(rtmCallbacks).map((callback) => {
        if (rtmCallbacks) {
          rtmEngineRef.current?.addListener(
            callback as keyof RtmClientEvents,
            // @ts-ignore - need to extend Rtm lib and infer event type
            rtmCallbacks[callback],
          );
        }
      });
    }

    if (rtcProps.tokenUrl) {
      const {tokenUrl, uid} = rtcProps;
      rtmEngineRef.current.addListener('TokenExpired', async () => {
        console.log('token expired');
        const res = await fetch(tokenUrl + '/rtm/' + (uid || 0) + '/');
        const data = await res.json();
        const token = data.rtmToken;
        rtmEngineRef.current?.renewToken(token);
      });
    }
  };

  const createUserData = () => {
    const userData: userDataType = {
      messageType: 'UserData',
      rtmId: String(rtmProps?.uid || rtcUidRef.current),
      rtcId: rtcUidRef.current as number,
      username: rtmProps?.username,
      role: rtcProps.role === ClientRoleType.ClientRoleAudience ? 1 : 0,
      uikit: {
        platform: Platform.OS,
        framework: 'reactnative',
        version: '5.0.1',
      },
      agora: {
        rtm: rtmVersion,
        rtc: rtcVersion ? rtcVersion : '4.x',
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
    // console.log('message', message, payload);
    const messageObject: messageObjectType = JSON.parse(payload);
    // console.log('handleReceivedMessage', messageObject, peerId);
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
    // console.log('gotMuteRequest', muteRequest);
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
      await rtmEngineRef.current?.sendMessage(rtcProps.channel, message, {});
    } catch (e) {
      console.log('sendMessage', e);
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
      await rtmEngineRef.current?.sendMessageToPeerV2(peerId, message, {});
    } catch (e) {
      console.log('sendMessageToPeerV2', e);
    }
  };

  const tryLeave = async () => {
    try {
      await rtmEngineRef.current?.leaveChannel(rtcProps.channel);
      rtmEngineRef.current?.removeAllListeners();
      setLogin(false);
      console.log('RTM cleanup done');
    } catch (e) {
      console.log(e);
    }
  };

  const end = async () => {
    rtcProps.callActive ? tryLeave() : {};
  };

  useEffect(() => {
    const setupRtm = async () => {
      await init();
      await login();
      await joinChannel();
    };
    setupRtm();
    return () => {
      end();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rtcProps.channel]);

  return (
    <RtmProvider
      value={{
        rtmStatus,
        sendPeerMessage,
        sendChannelMessage,
        sendMuteRequest,
        rtmClient: rtmEngineRef.current as RtmEngine,
        uidMap,
        usernames,
        userDataMap,
        popUpState,
        setPopUpState,
      }}>
      {isLogin ? props.children : <React.Fragment />}
    </RtmProvider>
  );
};

let rtmVersion: string;

RtmClient.getSdkVersion().then((version) => {
  rtmVersion = version;
});

export default RtmConfigure;
