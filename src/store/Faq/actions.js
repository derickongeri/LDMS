import { axiosInstance } from "boot/axios";
import {negative, positive} from 'src/Services/Notifications'
import {Log} from 'src/Services/Logger'

export async function getFaqs({commit}){
    try {
        let response = await axiosInstance.get('/api/faq/')
        if(response){
            Log('GetFaqs action', response.data);
            commit("Faqs", response.data)
        }
    } catch (error) {
        Log("Error GetFaq action")
    }
}