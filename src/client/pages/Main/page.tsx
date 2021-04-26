import * as React from 'react';
import { IHanana } from '../../../common/commonTypes';

export interface IPageProps {
    eventsList: IHanana[],
}

const MainPage: React.FunctionComponent<IPageProps> = ({
    eventsList,
}) => (
    <div>
        <a href="/search">Поиск</a>
        <br/>
        <h1>Выбери событие</h1>
        {eventsList.map(hanana => (
            <div key={hanana.id}>
                <a href={`/event/${hanana.id}`}>
                    <p>{hanana.title}</p>
                    <div>
                        {'Дата: '}
                        <span>{hanana.beginDate}</span>
                    </div>
                    <div>
                        {'Участники: '}
                        <span>{hanana.capacity}</span>
                    </div>
                </a>
            </div>
        ))}
    </div>
);

export default MainPage;