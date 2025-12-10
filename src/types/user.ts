export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture: string; // Optional, if you have a profile picture
  chips: number; // Assuming chips is a number, adjust type as necessary
  role:string;
  accessToken: string;
  // Add any other user properties you need
}