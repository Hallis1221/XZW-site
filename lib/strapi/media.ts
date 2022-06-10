import getStrapiURL from "strapi/url";
import { MetaImage } from "types/seo";

export function getStrapiMedia(media: MetaImage) {
  if (!media || !media.data || !media.data.attributes) {
    console.error("getStrapiMedia: media is not valid");
    return null;
  }

  const { url } = media?.data?.attributes;

  const imageUrl = url.startsWith("/") ? getStrapiURL(url) : url;
  return imageUrl;
}
