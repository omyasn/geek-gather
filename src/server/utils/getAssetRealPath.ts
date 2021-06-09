import * as fs from 'fs';
//import path from 'path';
//import * as assetsData from '../../../webpack-assets.json';

type AssetsData = {
    [key: string]: {
        [key: string]: string | string[];
    }
}

export const getAssetRealPath = (path: string): string => {
    const fullName = path.split('/').pop();
    const nameParts = fullName.split('.');
    const ext = nameParts.pop();
    const name = nameParts[0];

    const assetsData = JSON.parse(fs.readFileSync(
		'webpack-assets.json',
		'utf-8',
	));

    const asset = (assetsData as AssetsData)[name]
    ? (assetsData as AssetsData)[name][ext]
    : `${name}.${ext}`;

    if (!Array.isArray(asset)) {
        return asset;
    }

    return `${name}.${ext}`;
}

export default getAssetRealPath;