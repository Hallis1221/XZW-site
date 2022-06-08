import getStrapiURL  from "~/strapi/url";

export function getStrapiMedia(media: { data: { attributes: { url: any; }; }; }) {
  const { url } = media.data.attributes;
  const imageUrl = url.startsWith("/") ? getStrapiURL(url) : url;
  return imageUrl;
}