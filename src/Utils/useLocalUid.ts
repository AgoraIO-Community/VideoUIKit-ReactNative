import {useContext} from 'react';
import PropsContext from '../Contexts/PropsContext';

const useLocalUid: () => number | string = () => {
  const {rtcProps} = useContext(PropsContext);
  return rtcProps?.uid || 'local';
};
export default useLocalUid;
