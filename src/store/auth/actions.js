import { axiosInstance } from "boot/axios";
import {positive,negative} from 'src/Services/Notifications'
import {Log} from 'src/Services/Logger'
import {i18n} from 'boot/i18n'

export async function register({ commit }, details) {
  //register new user
  try {
    let response = await axiosInstance.post("/api/signup/", details);
    if (response) {
      Log("register response ", response.data);
      if (response.data.error) {
        return negative(response.data.error);
      }
      positive(response.data.message);
      return true;
    }
  } catch (error) {
    Log("register response error",error.response);
    if(error.response.hasOwnProperty('data')){
      if(Object.keys(error.response.data).length>0){
        let err = Object.values(error.response.data)[0]
        negative(err);
        Log("register response error ndani",error.response);
      }
    }else{
        Log("register response error",error.response);
    negative("There was an error while registering new User");
    }
  }
}

export async function login({ commit,dispatch  }, details) {
  try {
    let response = await axiosInstance.post("/api/login/", details);
    Log("login response ", response);
    if (response) {
      // Log("login response ", response);
      if (response.data.error) {
        return negative(response.data.error);
      }
      let user = await dispatch('Users/getuser',response.data.token,{ root: true })
      if(user)  {
        Log("User details ", user);
        let user_details = {
          name: user.first_name,
          last_name:user.last_name,
          token: response.data.token,
          is_active: user.is_active,
          is_admin: user.is_admin
        };
      localStorage.setItem("user", JSON.stringify(user_details));
      commit("loggedin",true);
      positive("successfully logged in");
      this.$router.push("/dashboard");
      }
    
    }
  } catch (error) {
    Log("login error ", error.response);
    negative(i18n.t('auth.login_error'),0);
  }
}
export async function resetpass({ commit }, email) {
  //reset password 
  try {
    Log("resetpass response ", email);
    let response = await axiosInstance.post("/api/requestpwdreset/ ", email);
    if (response) {
      Log("resetpass response ", response.data);
      positive(i18n.t(`resetPass['Please confirm password reset request from your email.']`),0); //used msg from api as translation block
    }
    // this.$router.push("/dashboard");
  } catch (error) {
    negative(error.response.data.message || "Error, request failed, try again",0);
    // negative(i18n.t('resetPass.fail_msg'),0)
    Log("Error in resetpass action,", error.response);
  }
}

export function Logout({ commit }) {
  try {
    localStorage.removeItem("user");
    commit("loggedin",false); //set logged in boolean to false
    commit("loggedUser",null);
    this.$router.push("/login");
   
  } catch (error) {
    Log(error);
  }
}
export function setLoggedin({commit},loggedUser){
    commit("loggedin",true); //set logged in boolean to true
    commit("loggedUser",loggedUser); //set logged in boolean to true
}
 export async function setnewpassword({commit}, newpassword){
 Log("setnewpassword ",newpassword)
 try {
   let response =await  axiosInstance.post("/api/resetpwd/", newpassword);
   if(response) {
     positive(response.data.message,0);
     this.$router.push("/login");
    }
   Log("setnewpassword ", response)
 } catch (error) {
   Log("setnewpassword error ", error.response.data.message);
   negative(error.response.data.message,0);
 }
 }