import { useEffect, useState } from 'react';
import { Text } from 'react-native';

export const Timer = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCounter(counter + 1), 1000)
    return () => clearInterval(timer)
  }, [counter]);

  const minutes = Math.trunc(counter / 60);
  const seconds = counter - minutes * 60;

  return <Text style={{color: 'white'}}>{`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</Text>
}

export default Timer;