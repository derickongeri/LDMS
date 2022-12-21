import { axiosInstance } from "boot/axios";
import { Loading, QSpinnerFacebook } from "quasar";
import { negative } from "src/Services/Notifications";
import { EventBus } from "src/Helpers/EventBus/eventBus.js";
import { Store } from "src/store";
const spinner =
  typeof QSpinnerFacebook !== "undefined"
    ? QSpinnerFacebook
    : Quasar.components.QSpinnerFacebook;
export async function RequestStats(url, requestData) {
  //get list of available rasters
  try {
    Loading.show({
      spinner,
      spinnerColor: "yellow",
      spinnerSize: 140,
      backgroundColor: "teal",
      messageColor: "white",
      message: "Analyzing ..."
    });
    let response = null;
    if (process.env.DEV)
      console.log("Token === ", localStorage.getItem("user"));
    EventBus.$emit("clear_legends_and_charts", false);
    if (localStorage.getItem("user") !== null) {
      response = await axiosInstance.post(url, requestData, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("user")).token
          }`
        }
      });
    } else {
      response = await axiosInstance.post(url, requestData);
    }

    if (response.data.hasOwnProperty("error")) {
      negative("Error, Could not complete the request", 0);
      Loading.hide();
      return;
    }
    Loading.hide();
    if (process.env.DEV) console.log("Response analysis: ", response.data);
    EventBus.$emit("clear_legends_and_charts", true);
    return response.data;
  } catch (error) {
 
    if (error.response.status >= 400 &&error.response.status<404) {
    
      Store.dispatch("auth/Logout");
    }
    if (process.env.DEV)
      console.log("Error in RequestData action,", error.response.status);
    Loading.hide();
    if (error.response.data?.startsWith("<!DOCTYPE html>")) {
      return negative("Error, Could not complete the request", 0);
    }
    negative("Error, Could not complete the request", 0);
    return;
  }
}
