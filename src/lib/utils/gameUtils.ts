export const getRotatedSeatIndex = (
  actualSeatNumber: number, 
  currentUserSeatNumber: number | undefined, 
  totalSeats: number
): number => {
  if (currentUserSeatNumber === undefined) return actualSeatNumber;
  return (actualSeatNumber - currentUserSeatNumber + totalSeats) % totalSeats;
};