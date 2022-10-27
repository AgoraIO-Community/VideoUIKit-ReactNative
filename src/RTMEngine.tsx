import RtmEngine from 'agora-react-native-rtm';

class RTMEngine {
  engine!: RtmEngine;
  private localUID: string = '';
  private channelId: string = '';

  private static _instance: RTMEngine | null = null;

  public static getInstance(appId: string) {
    if (!RTMEngine._instance) {
      return new RTMEngine(appId);
    }
    return RTMEngine._instance;
  }

  private async createClientInstance(appId: string) {
    await this.engine.createInstance(appId);
  }

  private async destroyClientInstance() {
    try {
      await this.engine?.logout();
    } catch (error) {
      console.log('Error logout: ', error);
    }
    try {
      await this.engine?.release();
    } catch (error) {
      console.log('Error release: ', error);
    }
  }

  private constructor(appId: string) {
    if (RTMEngine._instance) {
      return RTMEngine._instance;
    }
    RTMEngine._instance = this;
    this.engine = new RtmEngine();
    this.localUID = '';
    this.channelId = '';
    this.createClientInstance(appId);

    return RTMEngine._instance;
  }

  setLoginInfo(localUID: string, channelID: string) {
    this.localUID = localUID;
    this.channelId = channelID;
  }
  get localUid() {
    return this.localUID;
  }
  get channelUid() {
    return this.channelId;
  }
  destroy() {
    try {
      if (RTMEngine._instance) {
        this.destroyClientInstance();
        RTMEngine._instance = null;
      } else {
        console.log('destroy called but no instance');
      }
    } catch (error) {
      console.log('Error destroying instance error: ', error);
    }
  }
}

export default RTMEngine;
