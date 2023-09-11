import { NextResponse } from "next/server";
import BigCommerce from "node-bigcommerce";
import GlobalConfig from "../../globalConfig/config";

export async function POST(request) {
  const bigCommerce = new BigCommerce({
    clientId: GlobalConfig.clientId,
    storeHash: GlobalConfig.storeHash,
    accessToken: GlobalConfig.accessToken,
    responseType: GlobalConfig.responseType,
    headers: GlobalConfig.headers,
    apiVersion: GlobalConfig.apiVersion,
  });
  console.log(bigCommerce, "bigCommerce");
  const res = await request.json();
  console.log(res, "res");
  const validateUsers = await bigCommerce.post(
    "/customers/validate-credentials",
    res
  );

  return NextResponse.json(validateUsers);
}
