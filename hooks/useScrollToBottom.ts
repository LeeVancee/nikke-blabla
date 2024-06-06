import { useCallback, useEffect, useRef } from 'react';

const useScrollToBottom = (dependencies: any[] = []) => {
  const scrollContainer = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollTop = scrollContainer.current.scrollHeight;
    }
  }, [scrollContainer]);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom, ...dependencies]);

  return { scrollContainer, scrollToBottom };
};

export default useScrollToBottom;
