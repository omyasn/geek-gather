import { RequestHandler  } from 'express';
import severRenderAndSend from '../severRenderAndSend';
import { IPageParams } from '../html/preparePage';
import AboutPage from '../../client/pages/About/page';

const about: RequestHandler = (req, res, next) => {
    const pageParams: IPageParams = {
        initialData: {},
        title: 'About us',
        description: 'Page about us',
        pageName: 'about',
        PageComponent: AboutPage,
    };
    return severRenderAndSend(req, res, next, pageParams);
};

export default about;