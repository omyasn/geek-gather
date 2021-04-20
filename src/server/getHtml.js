export default ({
    title,
    description,
    rootString,
}) => {
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
                <h1>Greate new world!</h1>
                <script src="./client.js"></script>
            </body>
        </html>
    `;
};