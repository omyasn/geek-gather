import * as React from "react";
import { EventType } from "../../../common/commonTypes";
import TopImage from '../../components/TopImage';
import top from './images/top.jpg';
import styles from "./styles.scss";
import Text from '../../components/CoreComponents/Text';
import Link from '../../components/CoreComponents/Link';
import ImageTiles from "./ImageTiles";
import AdvantageCards from "./AdvantageCards";

export interface IPageProps {
  eventsList: EventType[];
}

const tiles = [{
  image: top,
  title: 'by Restricted Area',
  link: '/search?owner=Restricted+Area',
}, {
  image: top,
  title: 'in July',
  link: '/search?owner=Restricted Area', //TODO
}, {
  image: top,
  title: 'in Moscow',
  link: '/search?city=Moscow',
}, {
  image: '',
  title: '... or your own choice',
  link: '/search',
  darkText: true,
}]

const MainPage: React.FC<IPageProps> = ({ eventsList }) => (
  <div>
    <TopImage
      image={top}
      light
      title='Find easy ... play Hard'
      subTitle='paintball'
      className={styles.topImage}
    />

    <div className={styles.contentWrapper}>
      <Link header href="/search" className={styles.header}>Find what you want:</Link>

      <div className={styles.tiles}>
        {tiles.map((tile) => (
          <ImageTiles {...tile} key={tile.title} />
        ))}
      </div>

      <AdvantageCards />
      

{/*       
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
      ))} */}
    </div>


  </div>
);

export default MainPage;
