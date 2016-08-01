import {dispatch} from "../dispatcher";
import fetch from "isomorphic-fetch";
import Const from "../constants";

export default {
  create(toy){
    return fetch(`${Const.baseUrl}/manage/toys`, {
      method: "POST",
      timeout: 60 * 60 * 1000,
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(toy)
    }).then((res)=> res.json()).then((toy)=>{
      dispatch({type: Const.TOY_CREATE, toy});
      return toy;
    }).catch((err)=>{
      dispatch({type: Const.ERROR, err});
      throw err;
    });
  },
  modify(toy){
    return fetch(`${Const.baseUrl}/manage/toys/${toy.name}`, {
      method: "PUT",
      timeout: 60 * 60 * 1000,
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(toy)
    }).then((res)=> res.json()).then((toy)=>{
      dispatch({type: Const.TOY_MODIFY, toy});
      return toy;
    }).catch((err)=>{
      dispatch({type: Const.ERROR, err});
      throw err;
    });
  },
  fetchAll(){
    return fetch(`${Const.baseUrl}/manage/toys`, {
      method: "GET",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      }
    }).then((res)=> res.json()).then((toys)=>{
      dispatch({type: Const.TOY_FETCH_ALL, toys});
      return toys;
    }).catch((err)=>{
      dispatch({type: Const.ERROR, err});
    });
  },
  fetch(){
  }
};
