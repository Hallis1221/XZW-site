/**
 * @class MetaSeo
 * @description Represents meta tag properties based on the MetaSeo object passed from the strapi backend API.
 * @see https://market.strapi.io/plugins/@strapi-plugin-seo
 * @param metaTitle Effectivly the title of the page.
 * @param metaDescription The description of the page, as it appears in search engines.
 * @param metaKeywords The keywords of the page, will be used by search engines to index the page.
 * @param metaImage A image representing the page.
 * @param metaSocial The social network meta tags. @type {MetaSocial}
 * @param metaRobots The properties being used to robots to understand the page.
 * @param canonical The canonical url of the page.
 * @param metaViewport The viewport of the page.
 * @param structuredData A custom json object to be used by the page.
 */
export type MetaSeo = {
  metaTitle?: string | undefined;
  metaDescription?: string | undefined;
  metaImage?: MetaImage | undefined;
  metaSocial?: Array<MetaSocial> | undefined;
  keywords?: string | undefined;
  metaRobots?: string | undefined;
  canonical?: string | undefined;
  metaViewport?: string | undefined;
  structuredData?: string | undefined;
};

/**
 * @class MetaSocial 
 * @description Represents the meta tag properties for a social media site.
 * @param socialNetwork The name of the social media site. The backend currently supports Facebook and Twitter.
 * @param title The title of the page as it will appear on the social media site.
 * @param description The description of the page as it will appear on the social media site.
 * @param url The URL of the page as it will appear on the social media site.
 * @param image The image of the page as it will appear on the social media site, in for instance a Twitter card or other forms of embedding.
 */
export type MetaSocial = {
  socialNetwork?: string | undefined;
  title?: string | undefined;
  description?: string | undefined;
  image?: MetaImage | undefined;
};

/**
 * @class MetaImage 
 * @description Represents the meta tag properties for an image.
 * @todo: This currently only includes the bare minimum for the image with attributes being set to type of any. This should be expanded to include the full set of attributes as passed from the backend.
 */
export type MetaImage = {
  data?: {
    attributes: any;
  };
};
