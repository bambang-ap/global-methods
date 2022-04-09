import '../'
import {useEffect, useState} from 'react';

type UseTickerRet = [
  number,
  {
    paused: boolean;
    playPause: (set?: boolean) => void;
  } & Dict<() => void, 'play' | 'pause' | 'reset'>,
];

export const useTicker = (initial = 0, interval = 1000): UseTickerRet => {
  const [paused, setPaused] = useState(false);
  const [tick, setTicker] = useState(initial);

  useEffect(() => {
    const timeout = setInterval(() => {
      if (!paused) setTicker(tick + 1);
    }, interval);
    return () => clearInterval(timeout);
  }, [tick, paused]);

  return [
    tick,
    {
      paused,
      playPause(set) {
        if (typeof set === 'boolean') {
          setPaused(!set);
        } else {
          setPaused(!paused);
        }
      },
      play() {
        setPaused(false);
      },
      pause() {
        setPaused(true);
      },
      reset() {
        setTicker(initial);
      },
    },
  ];
};
