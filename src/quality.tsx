const quality = {
  '120p_1': {
    dimensions: {
      width: 160,
      height: 120,
    },
    frameRate: 15,
    bitRate: 65,
  },
  '120p_3': {
    dimensions: {
      width: 120,
      height: 120,
    },
    frameRate: 15,
    bitRate: 50,
  },
  '180p_1': {
    dimensions: {
      width: 320,
      height: 180,
    },
    frameRate: 15,
    bitRate: 140,
  },
  '180p_3': {
    dimensions: {
      width: 180,
      height: 180,
    },
    frameRate: 15,
    bitRate: 100,
  },
  '180p_4': {
    dimensions: {
      width: 240,
      height: 180,
    },
    frameRate: 15,
    bitRate: 120,
  },
  '240p_1': {
    dimensions: {
      width: 320,
      height: 240,
    },
    frameRate: 15,
    bitRate: 200,
  },
  '240p_3': {
    dimensions: {
      width: 240,
      height: 240,
    },
    frameRate: 15,
    bitRate: 140,
  },
  '240p_4': {
    dimensions: {
      width: 424,
      height: 240,
    },
    frameRate: 15,
    bitRate: 220,
  },
  '360p_1': {
    dimensions: {
      width: 640,
      height: 360,
    },
    frameRate: 15,
    bitRate: 400,
  },
  '360p_3': {
    dimensions: {
      width: 360,
      height: 360,
    },
    frameRate: 15,
    bitRate: 260,
  },
  '360p_4': {
    dimensions: {
      width: 640,
      height: 360,
    },
    frameRate: 30,
    bitRate: 600,
  },
  '360p_6': {
    dimensions: {
      width: 360,
      height: 360,
    },
    frameRate: 30,
    bitRate: 400,
  },
  '360p_7': {
    dimensions: {
      width: 480,
      height: 360,
    },
    frameRate: 15,
    bitRate: 320,
  },
  '360p_8': {
    dimensions: {
      width: 480,
      height: 360,
    },
    frameRate: 30,
    bitRate: 490,
  },
  '360p_9': {
    dimensions: {
      width: 640,
      height: 360,
    },
    frameRate: 15,
    bitRate: 800,
  },
  '360p_10': {
    dimensions: {
      width: 640,
      height: 360,
    },
    frameRate: 24,
    bitRate: 800,
  },
  '360p_11': {
    dimensions: {
      width: 640,
      height: 360,
    },
    frameRate: 24,
    bitRate: 1000,
  },
  '480p_1': {
    dimensions: {
      width: 640,
      height: 480,
    },
    frameRate: 15,
    bitRate: 500,
  },
  '480p_2': {
    dimensions: {
      width: 640,
      height: 480,
    },
    frameRate: 30,
    bitRate: 1000,
  },
  '480p_3': {
    dimensions: {
      width: 480,
      height: 480,
    },
    frameRate: 15,
    bitRate: 400,
  },
  '480p_4': {
    dimensions: {
      width: 640,
      height: 480,
    },
    frameRate: 30,
    bitRate: 750,
  },
  '480p_6': {
    dimensions: {
      width: 480,
      height: 480,
    },
    frameRate: 30,
    bitRate: 600,
  },
  '480p_8': {
    dimensions: {
      width: 848,
      height: 480,
    },
    frameRate: 15,
    bitRate: 610,
  },
  '480p_9': {
    dimensions: {
      width: 848,
      height: 480,
    },
    frameRate: 30,
    bitRate: 930,
  },
  '480p_10': {
    dimensions: {
      width: 640,
      height: 480,
    },
    frameRate: 10,
    bitRate: 400,
  },
  '720p_1': {
    dimensions: {
      width: 1280,
      height: 720,
    },
    frameRate: 15,
    bitRate: 1130,
  },
  '720p_2': {
    dimensions: {
      width: 1280,
      height: 720,
    },
    frameRate: 30,
    bitRate: 2000,
  },
  '720p_3': {
    dimensions: {
      width: 1280,
      height: 720,
    },
    frameRate: 30,
    bitRate: 1710,
  },
  '720p_5': {
    dimensions: {
      width: 960,
      height: 720,
    },
    frameRate: 15,
    bitRate: 910,
  },
  '720p_6': {
    dimensions: {
      width: 960,
      height: 720,
    },
    frameRate: 30,
    bitRate: 1380,
  },
};

export default quality;
export type VideoProfile = keyof typeof quality;
