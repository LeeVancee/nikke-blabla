'use client';

import { useEffect, useState } from 'react';

const Timer = () => {
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    function updateTime() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      setCurrentTime(`${formatTime(hours)}:${formatTime(minutes)}`);
    }

    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function formatTime(time: any) {
    return time < 10 ? `0${time}` : time;
  }
  return <>{currentTime}</>;
};

export default Timer;
