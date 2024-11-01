export default interface AssetContent {
    content: any;
    contentType: string;
}
export default interface CmsApi {
    getAssetContent: (draftId: string, asBlob?: boolean) => Promise<AssetContent | undefined>;
}
