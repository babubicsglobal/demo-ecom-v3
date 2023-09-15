import { NextResponse } from "next/server";
import BigCommerce from "node-bigcommerce";
import GlobalConfig from "../../globalConfig/config";
export async function POST(request) {
  const bigCommerce = new BigCommerce({
    clientId: GlobalConfig.clientId,
    storeHash: GlobalConfig.storeHash,
    accessToken: GlobalConfig.accessToken,
    responseType: GlobalConfig.responseType,
    headers:  {
        'X-Auth-Token': 'ma7p9efpdkp891wjm132dq7uhdtqu5k', 
        'Content-Type': 'application/json',
          "Access-Control-Allow-Origin" : "*",
         
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
          'Access-Control-Request-Method': 'GET, POST, DELETE, PUT, OPTIONS'
      },
    apiVersion: GlobalConfig.apiVersion,
  });
  
  const res = await request.json();
  console.log(res, "Pat request");
  const CreateToken = await bigCommerce.post(`/payments/access_tokens`, res);

  return NextResponse.json(CreateToken);
}