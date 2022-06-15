import * as React from "react";
import { EventType } from "../../../common/commonTypes";
import TopImage from '../../components/TopImage';
import top from './images/top.jpg';
import styles from "./styles.scss";
import Link from '../../components/CoreComponents/Link';
import ImageTiles from "./ImageTiles";
import AdvantageCards from "./AdvantageCards";

export interface IPageProps {
  eventsList: EventType[];
}


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
      <ImageTiles />

      <AdvantageCards />
    </div>
  </div>
);

export default MainPage;
