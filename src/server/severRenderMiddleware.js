import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../App';
import getHtml from './getHtml';

export default (req, res) => {
    const basePage = (<App />);
    const reactHtml = renderToString(basePage);
    const fullHtml = getHtml({
        title: 'lol',
        description: 'kek',
        rootString: reactHtml,
    });

    res.send(fullHtml);
}