import * as React from 'react';
import { IHanana } from '../../../common/commonTypes';
import styles from './styles.css';

export interface IPageProps {
    eventsList: IHanana[],
}

const MainPage: React.FC<IPageProps> = ({
    eventsList,
}) => (
    <div>
        <a href="/search">Поиск</a>
        <br/>
        <h1 className={styles.main}>Выбери событие</h1>
        {eventsList.map(hanana => (
            <div key={hanana.id}>
                <a href={`/event/${hanana.id}`}>
                    <p>{hanana.title}</p>
                    <div>
                        {'Дата: '}
                        <span>{hanana.beginDate}</span>
                    </div>
                    <div className={styles.image}>
                        {'Участники: '}
                        <span>{hanana.capacity}</span>
                    </div>
                </a>
            </div>
        ))}
    </div>
);

export default MainPage;