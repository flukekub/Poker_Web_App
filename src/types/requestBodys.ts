export type CreateTableBody = {
  tableName: string;
  description: string;
  gameType: string;
  minBuyIn: number;
  maxBuyIn: number;
  maxPlayers: number;
  currentPlayers: number;
};

export type CreateTablePlayerBody = {
  userId: number;
  tableId: number;
  stax: number;
  seatNumber: number;
};

export type TablePlayer = {
  tablePlayerId: number;
  userId: number;
  tableId: number;
  stax: number;
  seatNumber: number;
  joinedAt: string;
  isSitting: boolean;
  profileImageUrl: string;
  username: string;
};

export type CardDto = {
  suit: string; 
  rank: string; 
}

export type CardResponse = {
  cards:CardDto[];
}


