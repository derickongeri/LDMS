import { axiosInstance } from 'boot/axios'
import {Log} from 'src/Services/Logger'
export async function GetrasterTypes({ commit }) { //get rastertypes
    try {
        let response = await axiosInstance.get("/api/rastertype/")
        // Log("GetrasterTypes response ", response.data);
        commit('Rastertypes', response.data)
        return response.data
    } catch (error) {
        Log("Error in Getshapefile action,", error);
    }
}

export function setExtras({commit},extras){
    commit('SetswapObj', extras)
}