export const cardRankMapper: Record<string, string> = {
  ACE: "A",
  TWO: "2",
  THREE: "3",
  FOUR: "4",
  FIVE: "5",
  SIX: "6",
  SEVEN: "7",
  EIGHT: "8",
  NINE: "9",
  TEN: "10",
  J: "J",
  Q: "Q",
  K: "K",
};

export const mapCardRank = (rank: string): string => {
  return cardRankMapper[rank] || rank;
};

export const cardSuitMapper: Record<string, string> = {
  HEARTS: "♥",
  DIAMONDS: "♦",
  CLUBS: "♣",
  SPADES: "♠",
  H: "♥",
  D: "♦",
  C: "♣",
  S: "♠",
};

export const mapCardSuit = (suit: string): string => {
  return cardSuitMapper[suit] || suit;
};
