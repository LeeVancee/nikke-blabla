'use client';

import { useEffect, useState } from 'react';

const Timer = () => {
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    function updateTime() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const week = [
        '星期日',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
      ][now.getDay()];

      setCurrentTime(
        `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(
          seconds
        )} ${week}`
      );
    }

    const intervalId = setInterval(updateTime, 1000);

    // 在组件卸载时清除定时器
    return () => clearInterval(intervalId);
  }, []); // 仅在组件挂载时运行一次

  function formatTime(time: any) {
    return time < 10 ? `0${time}` : time;
  }
  return <>{currentTime}</>;
};

export default Timer;
