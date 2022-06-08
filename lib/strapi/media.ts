import getStrapiURL from "strapi/url";

export function getStrapiMedia(media: { data: { attributes: { url: any } } }) {
  if (!media)
    throw new Error(
      "Media is required. Are you sure the object excists? Excpected a media object, got: " +
        media
    );

  const { url } = media.data.attributes;
  const imageUrl = url.startsWith("/") ? getStrapiURL(url) : url;
  return imageUrl;
}
