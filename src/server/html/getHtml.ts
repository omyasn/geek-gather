export interface IHtmlPageParams {
    title: string;
    description: string;
}

interface IParams extends IHtmlPageParams {
    rootString: string;
}

export default ({
    title,
    description,
    rootString,
}: IParams):String => {
    return `
        <!DOCTYPE html>
        <html lang="ru">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">

                <meta name="description" content="${description}">
                <title>${title}</title>
            </head>

            <body>
                <div id="root">${rootString}</div>
                <script src="./client.js"></script>
            </body>
        </html>
    `;
};