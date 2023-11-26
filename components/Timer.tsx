'use client';

import { useEffect, useState } from 'react';

const Timer = ({ currentTime }: any) => {
  //  const [currentTime, setCurrentTime] = useState('');
  /*   useEffect(() => {
    function updateTime() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      setCurrentTime(`${formatTime(hours)}:${formatTime(minutes)}`);
    }

    const intervalId = setInterval(updateTime, 1000); // 更新间隔改为一秒

    // 在组件卸载时清除定时器
    return () => clearInterval(intervalId);
  }, []); // 仅在组件挂载时运行一次 */

  function formatTime(time: any) {
    return time < 10 ? `0${time}` : time;
  }
  return <>{currentTime}</>;
};

export default Timer;
