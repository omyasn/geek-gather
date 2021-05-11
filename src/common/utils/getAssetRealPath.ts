import * as assetsData from '../../../webpack-assets.json';

type AssetsData = {
    [key: string]: {
        [key: string]: string;
    }
}

export const getAssetRealPath = (assetsData: AssetsData) => (path: string): string => {
    const fullName = path.split('/').pop();
    const nameParts = fullName.split('.');
    const ext = nameParts.pop();
    const name = nameParts[0];

    const asset = (assetsData as AssetsData)[name]
    ? (assetsData as AssetsData)[name][ext]
    : `${name}.${ext}`;

    return asset;
}

export default getAssetRealPath(assetsData);