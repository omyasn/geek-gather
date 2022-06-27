import * as serializeJavascript from 'serialize-javascript';
import getAssetRealPath from '../utils/getAssetRealPath';

export interface IHtmlPageParams {
    title: string;
    description: string;
    pageName: string;
    initialData: object;
}

interface IParams extends IHtmlPageParams {
    rootString: string;
    preloadedState: object;
}

export default ({
    title,
    description,
    rootString,
    pageName,
    initialData,
    preloadedState,
}: IParams):String => {

    return `
        <!DOCTYPE html>
        <html lang="en-GB">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">

                <meta name="description" content="${description}">

                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Cuprum:wght@500&family=Nunito:wght@400;600&display=swap" rel="stylesheet">

                <link rel="stylesheet" href="${getAssetRealPath(`fontawesome.css`)}">
                <link rel="stylesheet" href="${getAssetRealPath(`css/${pageName}.css`)}">

                <title>${title}</title>
            </head>

            <body style="margin: 0;">
                <div id="root">${rootString}</div>
            </body>

            <script id="data-transfer">
                window.__INITIAL_DATA__=${serializeJavascript(initialData)};
                window.__PRELOADED_STATE__=${serializeJavascript(preloadedState)};
            </script>

            <script src="${getAssetRealPath(`js/${pageName}.bundle.js`)}"></script>
            <script src="${getAssetRealPath(`js/vendors.bundle.js`)}"></script>

        </html>
    `;
};