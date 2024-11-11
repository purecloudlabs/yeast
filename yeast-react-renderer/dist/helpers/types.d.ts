export default interface AssetContent {
    content: any;
    contentType: string;
}
export default interface CmsApi {
    AssetsApi: AssetsApi;
}
interface AssetsApi {
    getAssetContent: (draftId: string, asBlob?: boolean) => Promise<AssetContent | undefined>;
}
export {};
