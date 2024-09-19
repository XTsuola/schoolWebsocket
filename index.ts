// deno-lint-ignore-file
import {
  WebSocketClient,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import axiod from "https://deno.land/x/axiod@0.26.2/mod.ts";
import { login } from "./func.ts";

interface ObjListType {
  id: number;
  data: any;
  time: any;
}

const wss = new WebSocketServer(7003);
const objList: ObjListType[] = [];
wss.on("connection", function (ws: WebSocketClient | any) {
  ws.on("message", async function (message: string) {
    if (message != "undefined") {
      const params = JSON.parse(message);
      if (params.code == "update") { // 更新在线
        const ind = objList.findIndex((item: ObjListType) =>
          item.id == params.id
        );
        if (ind == -1) {
          objList.push({
            id: params.id,
            data: ws,
            time: new Date(),
          });
        } else {
          const data: ObjListType = {
            id: params.id,
            data: ws,
            time: new Date(),
          };
          objList.splice(ind, 1, data);
        }
        const data = {
          id: params.id,
          online: true,
        };
        try {
          await axiod.post(
            "http://127.0.0.1:7147/webSocketEditUser/",
            data,
          );
        } catch (_) {}
      }
      if (params.code == "status") { // 一直登录在线
        const ind = objList.findIndex((item: ObjListType) =>
          item.id == params.id
        );
        if (ind == -1) {
          objList.push({
            id: params.id,
            data: ws,
            time: new Date(),
          });
        } else {
          const data: ObjListType = {
            id: params.id,
            data: ws,
            time: new Date(),
          };
          objList.splice(ind, 1, data);
        }
        const data = {
          id: params.id,
          online: true,
        };
        await login(data);
      }
      if (params.code == "login") { // 登录在线
        const ind = objList.findIndex((item: ObjListType) =>
          item.id == params.id
        );
        if (ind == -1) {
          objList.push({
            id: params.id,
            data: ws,
            time: new Date(),
          });
        } else {
          const data: ObjListType = {
            id: params.id,
            data: ws,
            time: new Date(),
          };
          objList.splice(ind, 1, data);
        }
        const data = {
          id: params.id,
          online: true,
        };
        try {
          await axiod.post(
            "http://127.0.0.1:7147/webSocketEditUser/",
            data,
          );
        } catch (_) {}
      } else if (params.code == "logout") { // 退出离线
        const data = {
          id: params.id,
          online: false,
        };
        try {
          const res = await axiod.post(
            "http://127.0.0.1:7147/webSocketEditUser/",
            data,
          );
        } catch (_) {}
      } else if (params.code == "sendMessage") { // 发送消息
        const data = {
          id: parseInt(params.id),
          friendId: parseInt(params.friendId),
          info: params.info,
        };
        try {
          const res = await axiod.post(
            "http://127.0.0.1:7147/webSocketSendMessage/",
            data,
          );
          const ind1 = objList.findIndex((item: any) =>
            item.id == parseInt(params.id)
          );
          const ind2 = objList.findIndex((item: any) =>
            item.id == parseInt(params.friendId)
          );
          let info = {};
          if (res.data.code == 200) {
            info = {
              uid: "msgOk",
              ...res.data,
            };
          } else {
            info = {
              uid: "msgError",
              ...res.data,
            };
          }
          if (ind1 != -1) {
            objList[ind1].data.send(JSON.stringify(info));
          }
          if (ind2 != -1) {
            objList[ind2].data.send(JSON.stringify(info));
          }
        } catch (_) {}
      }
    }
  });
  ws.on("close", async function (code: number) {
  });
});

setInterval(async () => {
  const list = objList.map((item: any) => {
    return {
      id: item.id,
      status: (((new Date() as any) - item.time) / 1000) > 15 ? "离线" : "在线",
    };
  });
  for (let i = 0; i < list.length; i++) {
    if (list[i].status == "离线") {
      const data = {
        id: list[i].id,
        online: false,
      };
      try {
        await axiod.post(
          "http://127.0.0.1:7147/webSocketEditUser/",
          data,
        );
      } catch (_) {}
    }
  }
}, 10000);
