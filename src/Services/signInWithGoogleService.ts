import { errorAlert } from './commonFunctionService';
import UserPayload from "../models/UserPayload";
import axios from "axios";
import globals from "./Globals";
import store from "../Redux/Store";
import { setSessionAction } from "../Redux/SessionState";
import { CredentialResponse } from '../models/CredentialResponse';
const signInWithGoogleService = (response:CredentialResponse) => {
  axios
  .get<UserPayload>(globals.urls.localUrl + `googlesignin`, {
    headers: { token: response.credential },
  })
  .then((response) => {
    console.log(JSON.stringify(response.data));
    store.dispatch(
      setSessionAction({
        id: response.data.id,
        email: response.data.email as string,
        name: response.data.name as string,
        token: response.data.token as string,
        savedQuotes:response.data.savedQuotes as string[]
      })
    );
  })
  .catch((error) => {
    errorAlert(error);
  });
}

export default signInWithGoogleService;