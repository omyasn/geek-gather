import * as React from "react";
import { EventType } from "../../../common/commonTypes";
import styles from "./styles.css";

export interface IPageProps {
  eventsList: EventType[];
}

const MainPage: React.FC<IPageProps> = ({ eventsList }) => (
  <div>
    <a href="/search">Поиск</a>
    <br />
    <h1 className={styles.main}>Выбери событие</h1>
    {eventsList.map((event) => (
      <div key={event.id}>
        <a href={`/event/${event.id}`}>
          <p>{event.title}</p>
          <div>
            {"Дата: "}
            <span>{event.beginDate}</span>
          </div>
          <div className={styles.image}>
            {"Участники: "}
            <span>{event.capacity}</span>
          </div>
        </a>
      </div>
    ))}
  </div>
);

export default MainPage;
