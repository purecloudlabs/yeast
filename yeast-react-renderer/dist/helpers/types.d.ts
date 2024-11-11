export interface AssetContent {
    content: any;
    contentType: string;
}
export default interface CmsApi {
    AssetsApi: AssetsApi;
}
export interface AssetsApi {
    getAssetContent: (property: string, relativeKeyPath: string, asBlob?: boolean) => Promise<AssetContent | undefined>;
}
export declare enum CMSProperties {
    None = "",
    APICentral = "api-central",
    GCDevCenter = "gc-dev-center",
    YetiCMSDocs = "yeti-cms-docs"
}
