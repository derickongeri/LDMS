import { axiosInstance } from "boot/axios";

import {  negative } from "src/Services/Notifications";

export async function GetRegionalShape({ commit }) {
  //regional shape
  try {
    let response = await axiosInstance.get("/api/vectregional/");
    commit("regional", response.data);
    return response.data;
  } catch (error) {
    if(process.env.DEV) console.log("Error in Getshapefile action,", error);
    negative(error.response.data.message, 5000);
  }
}
export async function GetRegionVect({ commit, getters }, id) {
  try {
    if(process.env.DEV) console.log("getters getregionalvect", getters["getregionalvect"]);
    if (Object.keys(getters["getregionalvect"]).length > 0) {
      if(process.env.DEV) console.log("getregional");
      return getters["getregionalvect"];
    }
    if(process.env.DEV) console.log("getregional to request");
    let response = await axiosInstance.get(`/api/vectregional/${id}/`);
    if(process.env.DEV) console.log("getregional response ", response.data);
    commit("regionalvect", response.data);
    return response.data;
  } catch (error) {
    if(process.env.DEV) console.log("Error in Getshapefile action,", error);
    negative(error.response.data.message, 5000);
  }
}
export async function Getvect0List({ commit }) {
  //vect0
  try {
    let response = await axiosInstance.get("/api/vect0/");
    //if(process.env.DEV) console.log("Getvect0List response ", response.data);
    commit("vect0", response.data);
    return response.data;
  } catch (error) {
    if(process.env.DEV) console.log("Error in Getshapefile action,", error);
    negative(error.response.data.message, 5000);
  }
}
export async function Getvect0({ commit, getters }, id) {
  try {
    if (getters["getgeojson0"].length > 0) {
      if(process.env.DEV) console.log("getter vect0", getters["getgeojson0"]);
      let local = await getters["getgeojson0"].filter(obj => {
        return obj.id === id;
      });
      if (local.length > 0) {
        if(process.env.DEV) console.log("local ", local[0]);
        return local[0];
      }
    }
    let response = await axiosInstance.get(`/api/vect0/${id}/`);
    if(process.env.DEV) console.log("Confirming geojson0", response.data);
    // commit('geojson0', response.data)
    return response.data;
  } catch (error) {
    if(process.env.DEV) console.log("Error in Getshapefile action,", error);
    negative(error.response.data.message, 5000);
  }
}
export async function Getvect1List({ commit }) {
  try {
    let response = await axiosInstance.get(`/api/vect1/`);
    //Log("getsvect1List response ", response);
    commit("vect1", response.data);
    return response.data;
  } catch (error) {
    if(process.env.DEV) console.log("Error in getsvect1List action,", error);
    negative(error.response.data.message, 5000);
  }
}
export async function Getvect1({ commit, getters }, id) {
  try {
    if (getters["getgeojson1"].length > 0) {
      if(process.env.DEV) console.log("getters", getters["getgeojson1"]);
      let local = await getters["getgeojson1"].filter(obj => {
        return obj.id === id;
      });
      if (local.length > 0) {
        if(process.env.DEV) console.log("local ", local);
        return local[0];
      }
    }
    let response = await axiosInstance.get(`/api/vect1/${id}/`);
    if(process.env.DEV) console.log("getsvect1List response ", response.data);
    commit("geojson1", response.data);
    return response.data;
  } catch (error) {
    if(process.env.DEV) console.log("Error in getsvect1List action,", error);
    negative(error.response.data.message, 5000);
  }
}
export async function Getvect2List({ commit }) {
  try {
    let response = await axiosInstance.get(`/api/vect2/`);
    commit("vect2", response.data);
    // return response.data
  } catch (error) {
    if(process.env.DEV) console.log("Error in getsvect1List action,", error);
    negative(error.response.data.message, 5000);
  }
}
export async function Getvect2({ commit, getters }, id) {
  try {
    if (getters["getgeojson2"].length > 0) {
      if(process.env.DEV) console.log("getters", getters["getgeojson2"]);
      let local = await getters["getgeojson2"].filter(obj => {
        return obj.id === id;
      });
      if (local.length > 0) {
        if(process.env.DEV) console.log("local ", local);
        return local[0];
      }
    }
    let response = await axiosInstance.get(`/api/vect2/${id}/`);
    if(process.env.DEV) console.log("getsvect2List response ", response.data);
    commit("geojson2", response.data);
    return response.data;
  } catch (error) {
    if(process.env.DEV) console.log("Error in getsvect2List action,", error);
    negative(error.response.data.message, 5000);
  }
}
export function StoreCurrentGeoJson({ commit }, geojson) {
  if(process.env.DEV) console.log("geojson ", geojson);
  try {
    commit("currentGeoJson", geojson);
  } catch (error) {
    if(process.env.DEV) console.log("storecurrentGeoJson ", error);
  }
}
export function storeCountryGeoJson({ commit }, geojson) {
  try {
    if(process.env.DEV) console.log("storeCountryGeoJson ", geojson);
    commit("geojson0", geojson);
  } catch (error) {
    if(process.env.DEV) console.log("storeCountryGeoJson error ", error);
  }
}
export function geometry_loaded({ commit }, geometry_loaded) {
  if(process.env.DEV) console.log("geometry_loaded ", geometry_loaded);
  try {
    commit("geometry_loaded", geometry_loaded);
  } catch (error) {
    if(process.env.DEV) console.log("geometry_loaded error ", error);
    negative(error.response.data.message, 5000);
  }
}
export async function getCustomShapes({commit}){
  try {
    const response = await axiosInstance('/api/customvect/',{
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("user")).token
        }`
      }
    })
    if(response.data){
      if(process.env.DEV) console.log("getCustomShapes response", response.data);
      commit("customShapefiles",response.data)
    }
  } catch (error) {
    if(process.env.DEV) console.log("getCustomShapes ", error);
  }
}
export async function getCustomGeojson({commit},id){
  try {
    const response = await axiosInstance(`/api/customvect/${id}`,{
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("user")).token
        }`
      }
    })
    if(response.data){
      // commit("geojson2", response.data);
      if(process.env.DEV) console.log("getCustomGeojson response", response.data);
   return response.data
    }
  } catch (error) {
    if(process.env.DEV) console.log("getCustomGeojson ", error);
  }
}
