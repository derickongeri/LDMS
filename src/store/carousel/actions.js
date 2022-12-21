import { axiosInstance } from "boot/axios";
import {negative, positive} from 'src/Services/Notifications'
import {Log} from 'src/Services/Logger'

export async function getImages({commit}){
    try {
        let response = await axiosInstance.get('/api/gallery/')
        if(response){
            Log('getImages action', response.data);
            commit("carouselImages", response.data)
        }
    } catch (error) {
        
    }
}