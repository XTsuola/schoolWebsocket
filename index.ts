// deno-lint-ignore-file
import {
  WebSocketClient,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import axiod from "https://deno.land/x/axiod@0.26.2/mod.ts";
import { login } from "./func.ts";

const wss = new WebSocketServer(7003);
const idList: number[] = [];
const objList: any = [];
wss.on("connection", function (ws: WebSocketClient) {
  console.log(8888);
  ws.on("message", async function (message: string) {
    console.log(message, "msg");
    if (message != "undefined") {
      const params = JSON.parse(message);
      if (params.code == "login") { // 登录在线
        const ind = idList.findIndex((item: number) => item == params.id);
        if (ind == -1) {
          idList.push(params.id);
          objList.push(ws);
        } else {
          objList.splice(ind, 1, ws);
        }
        console.log(idList);
        console.log("改变登录状态为在线");
        const data = {
          id: params.id,
          online: true,
        };
        const res = await login(data);
        console.log(res, "pppp")
      } else if (params.code == "logout") { // 退出离线
        const ind = idList.findIndex((item: number) => item == params.id);
        /* if (ind == -1) {
          idList.push(params.id);
          objList.push(ws);
        } else {
          objList.splice(ind, 1, ws);
        }
        console.log(idList);
        console.log("改变登录状态为在线"); */
        console.log("改变登录状态为离线")
        const data = {
          id: params.id,
          online: false,
        };
        const res = await axiod.post(
          "http://127.0.0.1:7147/webSocketEditUser/",
          data,
        );
        if (res.data.code == 200) {
          console.log(res.data, "nnnn");
        }
      }
    }
    /* if (message != "undefined") {
      const params = JSON.parse(message);
      console.log(params, "params");
      if (params.connect == true) {
        const ind = idList.findIndex((item: number) => item == params.id);
        if (ind == -1) {
          idList.push(params.id);
          levelList.push(params.level)
          objList.push(ws);
        } else {
          objList.splice(ind, 1, ws);
        }
      } else {
        const map = await yidongguocheng(
          params.peoplex,
          params.peopley,
          params.peoplex1,
          params.peopley1,
          params.id,
          params.level,
        );

        const res = await axiod.post(
          "http://110.40.151.228:7147/mota/saveMap/",
          map,
        );
        if (res.data.code == 200) {
          const res2 = await axiod.get("http://110.40.151.228:7147/mota/getMap/");
          for (let i = 0; i < idList.length; i++) {
            objList[i].send(JSON.stringify(res2.data));
          }
        }
      }
    } */
  });
  
});