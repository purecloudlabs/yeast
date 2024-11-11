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
