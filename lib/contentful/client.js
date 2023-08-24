const contentful = require("contentful");

const IS_DEV = process.env.NODE_ENV === "development";
console.log(IS_DEV, process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_TOKEN);

export const client = contentful.createClient({
  accessToken: IS_DEV
    ? process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_TOKEN
    : process.env.NEXT_PUBLIC_CONTENTFUL_DELIVERY_TOKEN || "no token",
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  host: IS_DEV ? "preview.contentful.com" : "cdn.contentful.com",
});
