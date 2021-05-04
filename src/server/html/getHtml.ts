import * as serializeJavascript from 'serialize-javascript';

export interface IHtmlPageParams {
    title: string;
    description: string;
    pageName: string;
    initialData: object;
}

interface IParams extends IHtmlPageParams {
    rootString: string;
}

export default ({
    title,
    description,
    rootString,
    pageName,
    initialData,
}: IParams):String => {

    return `
        <!DOCTYPE html>
        <html lang="ru">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">

                <meta name="description" content="${description}">

                <link rel="stylesheet" href="./css/${pageName}.css">

                <title>${title}</title>
            </head>

            <body>
                <div id="root">${rootString}</div>
            </body>

            <script>
                window.__INITIAL_DATA__=${serializeJavascript(initialData)};
            </script>

            <script src="./js/${pageName}.bundle.js"></script>

        </html>
    `;
};