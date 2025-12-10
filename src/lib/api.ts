import api from "./axious";
import axios from "axios"
import { CreateTableBody } from "@/types/requestBodys";

export const userLogin = async (name: string, password: string) => {
  const fd = new FormData();
  fd.append("name", name);
  fd.append("password", password); // หรือ "username"
  try {
    const response = await api.post("/api/auth/login", fd);
    if (typeof window !== "undefined" && response.data?.token) {
      console.log( "Storing token in localStorage:", response.data.token );
    }
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const getMe = async (token: string) => {
  try {
    const response = await api.get("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
};

export const userRegister = async (
  name: string,
  file: File | null,
  email: string,
  password: string
) => {
  const fd = new FormData();
  fd.append("name", name);
  fd.append("email", email);
  fd.append("password", password);
  if (file) {
    fd.append("file", file);
  }
  try {
    const response = await api.post("/api/auth/register", fd);
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

export const createTable = async (
  token: string,
  tableName: string,
  description: string,
  gameType: string,
  maxPlayers: number,
  minBuyIn: number,
  maxBuyIn: number
) => {
    const body: CreateTableBody = {
    tableName: tableName,
    description: description,
    gameType: gameType,
    maxPlayers,
    minBuyIn,
    maxBuyIn,
    currentPlayers: 0,

  };

  try {
    const response = await api.post("/api/tables", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to create table status:", error.response?.status)
      console.error("Response body:", error.response?.data)
      if (error.response?.status === 401) {
        console.error("Unauthorized: check token validity / header format")
      }
    } else {
      console.error("Failed to create table:", error)
    }
    throw error
  }
};

export const getTablesByType = async (token: string, type?: string) => {
  try {
    if( !type ) throw new Error("missing type")
    const response = await api.get(`/api/tables/type`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { gameType: type },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch table data:", error);
    throw error;
  }
};
