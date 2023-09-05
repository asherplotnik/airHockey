import axios from 'axios';
import { removeSessionAction } from '../Redux/SessionState';
import store from '../Redux/Store';

const jwtAxios = axios.create();

// Request interceptor - מה אנו רוצים לבצע בכל שליחת בקשה לשרת
jwtAxios.interceptors.request.use(
    request => {
        const token = store.getState().SessionState.session.token;
        if (token) {
            request.headers.set("token", token);
        }
        return request;
    },
    error => {
        console.log("jwtError:");
        console.log(error);
    }
);

jwtAxios.interceptors.response.use(
    successRes => {
       return successRes;
    }, 
    error => {
      if (error.response.data.status===401){
        store.dispatch(removeSessionAction());
      }
      return Promise.reject(error);
    }
  );


export default jwtAxios;
