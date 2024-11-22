export interface AssetContent {
    content: any;
    contentType: string;
}

export default interface CmsApi {
    AssetsApi: AssetsApi;
}

export interface AssetsApi {
    getAssetContent: (property: string, relativeKeyPath: string, asBlob?: boolean, suppressToast?: boolean) => Promise<AssetContent | undefined>;
}

export interface Toast {
	title?: string;
	message: string;
	link?: string;
	linkText?: string;
	key?: any;
	toastType?: ToastType;
	timeoutSeconds?: number;
}

export type ToastFn = (toast: Toast) => any;

export enum ToastType {
	Info = 'info',
	Warning = 'warning',
	Critical = 'critical',
	Success = 'success',
}

export enum CMSProperties {
	None = '',
	APICentral = 'api-central',
	GCDevCenter = 'gc-dev-center',
	YetiCMSDocs = 'yeti-cms-docs',
}
