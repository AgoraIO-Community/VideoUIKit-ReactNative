import { useEffect, useState } from 'react';
import { Text } from 'react-native';

export const Timer = () => {
  const [counter, setCounter] = useState(0);
  const [start, setStart] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCounter(Date.now() - start), 1000)
    return () => clearInterval(timer)
  }, [counter]);

  useEffect(() => {
    setStart(Date.now());
  }, []);

  const minutes = Math.trunc(counter / 60);
  const seconds = counter - minutes * 60;

  return <Text style={{color: 'white', textAlign: 'left', alignSelf: 'center', alignItems: 'center', height: '100%'}}>{`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</Text>
}

export default Timer;