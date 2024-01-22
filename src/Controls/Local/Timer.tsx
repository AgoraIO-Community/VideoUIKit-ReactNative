import { useEffect, useState } from 'react';
import { Text } from 'react-native';

export const Timer = () => {
  const [counter, setCounter] = useState(0);
  const [start, setStart] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCounter(Date.now() - start), 1000)
    return () => clearInterval(timer)
  }, [counter]);

  return <Text style={{color: 'white', textAlign: 'left', alignSelf: 'center', alignItems: 'center', height: '100%'}}>{new Date(counter).toISOString().slice(14, 19)}</Text>
}

export default Timer;