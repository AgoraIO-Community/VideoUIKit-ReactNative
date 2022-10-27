//@ts-nocheck
import {Platform} from 'react-native';

const isSafariBrowser = () => {
  if (Platform.OS !== 'web') {
    return false;
  }
  if (!('userAgent' in navigator)) {
    console.warn('unable to detect browser');
    return false;
  }

  const userAgentString = navigator.userAgent;
  // Detect Chrome
  const chromeAgent = userAgentString.indexOf('Chrome') > -1;
  // Detect Safari
  const safariAgent = userAgentString.indexOf('Safari') > -1;

  // One additional check is required in the case of the Safari browser
  // as the user-agent of the Chrome browser also includes the Safari browser’s user-agent.
  // If both the user-agents of Chrome and Safari are in the user-agent,
  // it means that the browser is Chrome, and hence the Safari browser value is discarded.

  if (chromeAgent && safariAgent) {
    return false;
  } // Discard Safari since it also matches Chrome
  return true;
};

export default isSafariBrowser;
