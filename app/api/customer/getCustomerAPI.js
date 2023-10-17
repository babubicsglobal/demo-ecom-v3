import axios from "axios";

export function CustomerAPI(config, callback, errorcallback) {
  const URL = "../api/allCustomers";
  axios
    .get(URL, config)
    .then((res) => {
      //do something
      console.log("Benefit banner api working", res);
      if (callback != null) {
        callback(res);
      }
    })
    .catch((err) => {
      // catch error
      if (errorcallback != null) {
        // console.log("benefits banner not api working");
        errorcallback(err);
      }
    });
}
