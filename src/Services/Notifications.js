import { Notify } from "quasar";

export function negative(message,time=2500) {
   return Notify.create({
      progress: true,
      type: "negative",
      position: "top-right",
      message: `${message}`,
      closeBtn:true,
      timeout:time
    });
  }
 export function positive(message,time=2500) {
   return Notify.create({
      progress: true,
      type: "positive",
      position: "top-right",
      message: `${message}`,
      timeout:time,
      closeBtn:true,
    });
  }
  