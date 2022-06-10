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

export type MetaSocial = {
    socialNetwork?: string | undefined;
    title?: string | undefined;
    description?: string | undefined;
    image?: MetaImage | undefined;
}

export type MetaImage = {
    data?: {
        attributes: any
    }
}