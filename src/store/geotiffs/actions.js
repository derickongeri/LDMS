import { axiosInstance } from 'boot/axios'
import {Log} from 'src/Services/Logger'
export async function GetRasterList({ commit }) { //get list of available rasters
    try {
        // Log("I am being called getrasterlist");
        let response = await axiosInstance.get("/api/rasters/");
        commit('RasterList', response.data)
        return response.data
    } catch (error) {
        Log("Error in GetRasterList action,", error);
    }
}
export async function GetOneraster({ commit,getters }, id) { //vect0
    try {
        if (getters["getRasters"].length > 0) {
            Log("getters one raster", getters["getRasters"]);
            let local = await getters["getRasters"].filter((obj) => {
                return obj.id === id;
            });
            if (local.length>0) {
                Log("local ", local);
                return local[0]
            }
        }
        let response = await axiosInstance.get(`/api/rasters/${id}/`);
        Log("GetOneraster response ", response.data);
        commit('Raster', response.data)
        return response.data
    } catch (error) {
        Log("Error in Getshapefile action,", error);
    }
}
export async function GetOnerasterfile({ commit,getters }, url) { //will work on saving the files on vuex
    try {
        if (getters["getRastersfiles"].length > 0) {
            Log("getters", getters["getRastersfiles"]);
            let local = await getters["getRastersfiles"].filter((obj) => {
                return obj.id === id;
            });
            if (local.length>0) {
                Log("local ", local);
                return local[0]
            }
        }
        let response = await axiosInstance.get(`/api/rasters/${id}/`);
        // Log("getRastersfiles response ", response.data);
        commit('Rasterfile', response.data)
        return response.data
    } catch (error) {
        Log("Error in getRastersfiles action,", error);
    }
}

export function storeTiffFile({commit}, tiff){
    try {
        commit('storeTiffFile', tiff)
    } catch (error) {
        Log("storeTiffFile Error ", error)
    }
}