// deno-lint-ignore-file
import axiod from "https://deno.land/x/axiod@0.26.2/mod.ts";

export async function login(params: any) { // 登录在线
  const res = await axiod.post(
    "http://127.0.0.1:7147/webSocketEditUser/",
    params,
  );
  if (res.data.code == 200) {
    return res.data;
  }
}

export async function logout(params: any) { // 退出离线
    const res = await axiod.post(
      "http://127.0.0.1:7147/webSocketEditUser/",
      params,
    );
    if (res.data.code == 200) {
      return res.data;
    }
  }