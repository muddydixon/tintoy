import {dispatch} from "../dispatcher";
import fetch from "isomorphic-fetch";
import Const from "../constants";

export default {
  set(key, val){
    return fetch(`${Const.baseUrl}/manage/config`, {
      method: "PUT",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({[key]: val})
    }).then((res)=> res.json()).then((config)=>{
      dispatch({type: "CONFIG_MODIFY", config});
      return config;
    }).catch((err)=>{
      dispatch({type: "ERROR", err});
    });
  },
  fetch(){
    return fetch(`${Const.baseUrl}/manage/config`, {
      method: "GET",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      }
    }).then((res)=> res.json()).then((config)=>{
      dispatch({type: "CONFIG_FETCH", config});
      return config;
    }).catch((err)=>{
      dispatch({type: "ERROR", err});
    });
  }
};
