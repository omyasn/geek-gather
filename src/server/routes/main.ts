import { RequestHandler } from "express";
import severRenderAndSend from "../severRenderAndSend";
import { IPageParams } from "../html/preparePage";
import MainPage, { IPageProps } from "../../client/pages/Main/page";
import { events } from "../../mockData/events";
import { BackendEvent } from "../../common/commonTypes";

const main: RequestHandler = (req, res, next) => {
  const initialData = getBackendData();

  const pageParams: IPageParams = {
    initialData,
    title: "Main",
    description: "My main Page",
    pageName: "main",
    PageComponent: MainPage,
  };
  return severRenderAndSend(req, res, next, pageParams);
};

const getBackendData = (): IPageProps => {
  const backendData: BackendEvent[] = events;
  const allEvents = backendData.map(({ id, resourceContent }) => ({
    id,
    ...resourceContent,
  }));
  return {
    eventsList: allEvents,
  };
};

export default main;
