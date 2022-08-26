import {Permission, PermissionsAndroid} from 'react-native';
/**
 * @name requestCameraAndAudioPermission
 * @description Function to request permission for Audio and Camera
 */
export default async function requestCameraAndAudioPermission(
  audioRoom: boolean,
) {
  try {
    const permissionsToRequest: Permission[] = [];
    permissionsToRequest.push(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    if (!audioRoom) {
      permissionsToRequest.push(PermissionsAndroid.PERMISSIONS.CAMERA);
    }
    const granted = await PermissionsAndroid.requestMultiple(
      permissionsToRequest,
    );
    if (
      granted['android.permission.RECORD_AUDIO'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.CAMERA'] ===
        PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('You can use the cameras & mic');
    } else if (
      granted['android.permission.RECORD_AUDIO'] ===
      PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('You can use mic');
    } else {
      console.log('Permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}
