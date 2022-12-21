export default function () {
  return {
    EmailedTaskID:null, //curent taskid being viewed
    Results:null, //holds results from queued tasks
    default_years: true, //boolean to determine of we should use default years
    QueuedTasks:[], //holds queued tasks
  }
}
