import * as fs from 'fs';

type AssetsData = {
    [key: string]: {
        [key: string]: string | string[];
    }
}

const getAssets = ():AssetsData => {
    return JSON.parse(fs.readFileSync(
		'webpack-assets.json',
		'utf-8',
	));
}

export const getAssetRealPath = (getAssets: () => AssetsData) =>
(path: string): string => {
    const fullName = path.split('/').pop();
    const nameParts = fullName.split('.');
    const ext = nameParts.pop();
    const name = nameParts[0];

    const assetsData = getAssets();

    const asset = (assetsData as AssetsData)[name]
    ? (assetsData as AssetsData)[name][ext]
    : `${name}.${ext}`;

    if (!Array.isArray(asset)) {
        return asset;
    }

    return `${name}.${ext}`;
}

export default getAssetRealPath(getAssets);