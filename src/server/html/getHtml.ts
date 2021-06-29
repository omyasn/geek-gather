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
    preloadedState: any; // TODO
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
        <html lang="ru">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">

                <meta name="description" content="${description}">

                <link rel="stylesheet" href="${getAssetRealPath(`css/${pageName}.css`)}">

                <title>${title}</title>

                <link rel="preconnect" href="https://fonts.gstatic.com">
                <link href="https://fonts.googleapis.com/css2?family=Cuprum:wght@500&family=Nunito&display=swap" rel="stylesheet">
            </head>

            <body style="margin: 0;">
                <div id="root">${rootString}</div>
            </body>

            <script>
                window.__INITIAL_DATA__=${serializeJavascript(initialData)};
                window.__PRELOADED_STATE__=${serializeJavascript(preloadedState)};
            </script>

            <script src="${getAssetRealPath(`js/${pageName}.bundle.js`)}"></script>
            <script src="${getAssetRealPath(`js/vendors.bundle.js`)}"></script>

        </html>
    `;
};