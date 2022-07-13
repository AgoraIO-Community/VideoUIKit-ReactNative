import {useContext} from 'react';
import PropsContext from '../Contexts/PropsContext';

const useLocalUid = () => {
  const {rtcProps} = useContext(PropsContext);
  return rtcProps?.uid || 0;
};
export default useLocalUid;
