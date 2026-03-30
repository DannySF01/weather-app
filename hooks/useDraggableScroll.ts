import { useRef, useState, MouseEvent } from "react";

export const useDraggableScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e: MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Velocidade do scroll
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return {
    scrollRef,
    isDragging,
    events: {
      onMouseDown,
      onMouseLeave: onMouseUpOrLeave,
      onMouseUp: onMouseUpOrLeave,
      onMouseMove,
    },
  };
};
