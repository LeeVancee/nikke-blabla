'use client';

import { useEffect, useState } from 'react';

const Timer = () => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    let animationFrameId: number;

    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      setCurrentTime(`${formatTime(hours)}:${formatTime(minutes)}`);

      animationFrameId = requestAnimationFrame(updateTime);
    };

    updateTime();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : time;
  };

  return <>{currentTime}</>;
};

export default Timer;
