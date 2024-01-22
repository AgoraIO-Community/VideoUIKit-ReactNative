import { useEffect, useState } from 'react';
import { Text } from 'react-native';

export const Timer = () => {
  const [counter, setCounter] = useState(0);
  const [start, setStart] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCounter(Date.now() - start), 1000)
    return () => clearInterval(timer)
  }, [counter]);

  const minutes = Math.floor(counter / 60000);
  const seconds = Math.floor(counter / 1000);

  return <Text style={{color: 'white', textAlign: 'left', alignSelf: 'center', alignItems: 'center', height: '100%'}}>{`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</Text>
}

export default Timer;