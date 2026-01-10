export type PlayerPosition = {
  id: number;
  positionFalse: string;
  positionTrue: string;
  defaultName: string;
  defaultBalance: string;
};
export type PlayerIngamePosition = {
  id: number;
  position: string;
};

export const SEAT_POSITIONS: PlayerPosition[] = [
  {
    id: 1,
    positionFalse: "left-1/2 bottom-[-15%] -translate-x-1/2",
    positionTrue: "left-1/2 bottom-[-15%] -translate-x-1/2  sm:bottom-[-15%]",
    defaultName: "Player 1",
    defaultBalance: "9999 $",
  },
  {
    id: 2,
    positionFalse: "right-[5%] bottom-[5%]",
    positionTrue: "right-[5%] bottom-[5%] sm:right-[-5%] sm:bottom-[-5%]",
    defaultName: "Player 2",
    defaultBalance: "8888 $",
  },
  {
    id: 3,
    positionFalse: "top-[40%] right-[-8%]",
    positionTrue: "right-[-4%] top-[40%]  sm:top-[40%] sm:right-[-18%]",
    defaultName: "Player 3",
    defaultBalance: "7777 $",
  },
  {
    id: 4,
    positionFalse: "right-[5%] top-[5%]",
    positionTrue: "right-[5%] top-[5%] sm:right-[-5%] sm:top-[-5%]",
    defaultName: "Player 4",
    defaultBalance: "6666 $",
  },
  {
    id: 5,
    positionFalse: "right-[20%] sm:right-[30%] top-[-10%]",
    positionTrue: "right-[20%] sm:right-[25%] top-[-15%]",
    defaultName: "Player 5",
    defaultBalance: "5555 $",
  },
  {
    id: 6,
    positionFalse: "left-[20%] sm:left-[30%] top-[-10%]",
    positionTrue: "left-[20%] sm:left-[25%] top-[-15%]",
    defaultName: "Player 6",
    defaultBalance: "4444 $",
  },
  {
    id: 7,
    positionFalse: "left-[5%] top-[5%]",
    positionTrue: "left-[5%] top-[5%] sm:left-[-5%] sm:top-[-5%]",
    defaultName: "Player 7",
    defaultBalance: "3333 $",
  },
  {
    id: 8,
    positionFalse: "left-[-8%] sm:left-[-10%] top-[40%]",
    positionTrue: "left-[-4%] top-[40%] sm:left-[-18%] ",
    defaultName: "Player 8",
    defaultBalance: "2222 $",
  },
  {
    id: 9,
    positionFalse: "left-[5%] bottom-[5%]",
    positionTrue: "left-[5%] bottom-[5%] sm:left-[-5%] sm:bottom-[-5%]",
    defaultName: "Player 9",
    defaultBalance: "1111 $",
  },
];

export const INGAME_PLAYER_POSITIONS: PlayerIngamePosition[] = [
  {
    id: 1,
    position: "left-1/2 bottom-[-17%] -translate-x-1/2 sm:bottom-[-15%]",
  },
  {
    id: 2,
    position: "left-[11%] bottom-[-6%] sm:left-[-5%] sm:bottom-[-10%]",
  },
  {
    id: 3,
    position: "left-[0%] bottom-[15%] sm:left-[-20%] sm:bottom-[20%]",
  },
  {
    id: 4,
    position: "left-[-2%] top-[40%] sm:top-[27%] sm:left-[-25%]",
  },
  {
    id: 5,
    position: "left-[5%] top-[5%] sm:left-[-5%] sm:top-[-5%]",
  },
  {
    id: 6,
    position: "right-[5%] top-[5%] sm:right-[-5%] sm:top-[-5%]",
  },
  {
    id: 7,
    position: "right-[-2%] top-[40%] sm:top-[27%] sm:right-[-25%]",
  },
  {
    id: 8,
    position: "right-[0%] bottom-[15%] sm:right-[-20%] sm:bottom-[20%]",
  },
  {
    id: 9,
    position: "right-[10%] bottom-[-6%] sm:right-[-5%] sm:bottom-[-10%]",
  },
];
