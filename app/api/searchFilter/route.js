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
  console.log(request, "request");
  const res = await request.json();
  console.log(res, "resquery");
  if(res.from === "filter"){
    const products = await bigCommerce.get(
      `/catalog/products?price:min=${res.minPrice}&price:max=${res.maxPrice}&include=images,variants`
    );
    return NextResponse.json(products);
  }else{
    const products = await bigCommerce.get(
      `/catalog/products?keyword=${res.searchKey}&include=images,variants`
    );
    return NextResponse.json(products);
  }
 
}
