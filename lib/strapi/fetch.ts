import qs from "qs";
import getStrapiURL from "strapi/url";

/**
 * Helper to make GET requests to Strapi API endpoints
 * @param {string} path Path of the API route
 * @param {Object} urlParamsObject URL params object, will be stringified
 * @param {Object} options Options passed to fetch
 * @returns Parsed API call response
 */

export default async function fetchAPI(
  path: string,
  urlParamsObject: object = {},
  options: object = {},
  method: string = "GET"
) {
  // Merge default and user options
  const mergedOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + process.env.STRAPI_API_KEY,
    },
    ...options,
  };

  // Build request URL
  const queryString = qs.stringify(urlParamsObject);
  const requestUrl = `${getStrapiURL(
    `/api${path}${queryString ? `?${queryString}` : ""}`
  )}`;

  // Trigger API call
  const response = await fetch(requestUrl, mergedOptions);

  // Handle response
  if (!response.ok) {
    let message = await response.json();
    console.error(message);
    throw new Error(
      `An error occured while fetching ${requestUrl}, status: ${response.status}`
    );
  }
  const data = await response.json();
  return data;
}
