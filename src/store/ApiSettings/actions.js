
import { axiosInstance } from "boot/axios";
import {Log} from 'src/Services/Logger'
export async function GetApiSettings ({commit}) {
 try {
     const settings = await axiosInstance.get('api/settings/')
     if(settings){
         Log("GetApiSettings ",settings.data[0])
         commit("ApiSettings", settings.data[0])
     }
 } catch (error) {
    Log("GetApiSettings Error ",error)
 }
}

export function SetcurrentThresholdArea({commit}, area){
    commit('currentThresholdArea', area)
}
