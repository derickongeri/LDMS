import { axiosInstance } from "boot/axios";
import {negative, positive} from 'src/Services/Notifications'

export async function getuser({ commit,getters },token) {
    try {
       let user = getters['getuser']
       if(user){
        //    positive(user)
           return user
       }
    //    negative("no user found, using axios")

      let response = await axiosInstance.get("/api/user/", {
        headers: {
          Authorization: `Bearer  ${token}`
        }
      });
      if (response.data) {
        if(process.env.DEV)console.log("getuser response ", response.data.data[0]);
        commit("user", response.data.data[0]);
      }
      return response.data.data[0];
    } catch (error) {
      if(process.env.DEV)console.log("Error in Get user action,", error);
      negative("Could not get user, please login",0);
    }
  }
export async function getusers({ commit }) {
    try {
      let response = await axiosInstance.get("/api/users/", {
        headers: {
            Authorization: `Bearer  ${JSON.parse(localStorage.getItem("user")).token}`
        }
      });
      if (response) {
        if(process.env.DEV)console.log("getusers response ", response.data);
        commit("users", response.data);
      }
      return response.data;
    } catch (error) {
      if(process.env.DEV)console.log("Error in GetRasterList action,", error);
    }
  }
  export async function updateuser({ commit,dispatch }, details) {
    //register new user
    try {
      if(process.env.DEV)console.log("updateuser ", details);
      let response = await axiosInstance.post("/api/updateuser/", details,{
        headers: {
          Authorization: `Bearer  ${JSON.parse(localStorage.getItem("user")).token}`
        }
      });
      if (response) {
        if(process.env.DEV)console.log("register response ", response.data);
        if (response.data.error) {
          return negative("could not update user ",5000);
        }
        positive(response.data.message)
        dispatch('getusers');
      }
      return response.data;
    } catch (error) {
      if(process.env.DEV)console.log("Error in GetRasterList action,", error);
    }
  }