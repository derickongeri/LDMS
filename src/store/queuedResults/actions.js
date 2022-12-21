import { axiosInstance } from "boot/axios";
import { negative, positive } from "src/Services/Notifications"; // logger service
import { Log } from "src/Services/Logger";
import {i18n} from 'boot/i18n'
export function setEmailTaskID({ commit,dispatch }, id) { //set the taskId to store
  Log("set EmailedTaskID ", id);
  commit("EmailedTaskID", id);
  if(id)dispatch('getResults', id)
}
export function disable_default_years({commit}, val){
  commit("SeTDefaultYears", val) //boolean to check if we have results, we show result years
}
export async function getResults({ commit }, id) { //make api call with taskid and get results
 //get user token for the request data
 const token = checkToken()
 if(token === null) {
  // Log("checkToken 17", response.data)
  this.$router.push("/login"); 
  return
}
  let response = await axiosInstance.get('/api/tasks/'+id, {
    headers: {
      Authorization: `Bearer  ${token}`
    }
  });
  if(response) {
    Log("Task Response 17", response.data)
    
    commit("SeTResults",response.data ) // add the result data to the store

  }
}
export function clearResult({commit}){ //used to clear the result data from the store
  commit("SeTResults",null )
}

export  function checkQueued({commit}){
  const token = checkToken()
  if(token === null) {
    Log("checkQueued error 40 token", token)
   this.$router.push("/login"); 
   return
 }
  setInterval(async ()=>{
   const tasks= await check_queued(token)
   Log("xxxxxxxxxxxxxxxxxxxx ", tasks)
   commit("SetQueuedTasks", tasks)
  },300000)
}
const check_queued = async (token)=>{
try {
  const results = await axiosInstance.get('api/tasks',{
    headers: {
      Authorization: `Bearer  ${token}`
    }
  })
  if(results) return results.data
} catch (error) {
  Log("check_queued ",error)
}
}

const checkToken = ()=>{
  if(!localStorage.getItem("user")){ //check if user is loggged in if not make the user login
    const msg =i18n.t('Login_msg_Results')
    // negative(msg,0)
    return null
  }
  const token = JSON.parse(localStorage.getItem("user")).token
  return token
}