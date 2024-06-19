import axios from "axios";
import qs from "qs";

const apis = {
  register: async (username: string, email: string, password: string) => {
    try {
      return await axios.post(
        `${process.env.EXPO_PUBLIC_BE}/auth/local/register`,
        {
          username,
          email,
          password,
        }
      );
    } catch (err) {
      throw new Error();
    }
  },
  login: async (username: string, password: string) => {
    try {
      return await axios.post(`${process.env.EXPO_PUBLIC_BE}/auth/local`, {
        identifier: username,
        password,
      });
    } catch (err) {
      throw new Error();
    }
  },
  get: async (url: string, query?: object) => {
    const localInfo = localStorage.getItem("etwl");
    const token = localInfo ? JSON.parse(localInfo as string).token : null;

    try {
      return await axios.get(
        `${process.env.EXPO_PUBLIC_BE}/${url}${
          query ? `?${qs.stringify(query, { encodeValuesOnly: true })}` : ""
        }`,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      );
    } catch (err) {
      throw new Error();
    }
  },
  getOne: async (url: string, id: number, query?: object) => {
    const localInfo = localStorage.getItem("etwl");
    const token = localInfo ? JSON.parse(localInfo as string).token : null;

    try {
      return await axios.get(
        `${process.env.EXPO_PUBLIC_BE}/${url}/${id}${
          query ? `?${qs.stringify(query, { encodeValuesOnly: true })}` : ""
        }`,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      );
    } catch (err) {
      throw new Error();
    }
  },
  post: async (url: string, data: any) => {
    const localInfo = localStorage.getItem("etwl");
    const token = localInfo ? JSON.parse(localInfo as string).token : null;

    try {
      return await axios.post(
        `${process.env.EXPO_PUBLIC_BE}/${url}`,
        {
          ...data,
        },
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      );
    } catch (err) {
      throw new Error();
    }
  },
};

export default apis;
