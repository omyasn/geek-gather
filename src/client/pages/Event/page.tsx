import * as React from 'react';
import { EventDetails, ILocation } from '../../../common/commonTypes';
import styles from './styles.scss'

export interface IPageProps {
    details: EventDetails;
    location: ILocation;
}

const EventPage: React.FC<IPageProps> = ({
    details,
    location,
}) => (
    <div className={styles.wrapper}>
        <h1>{details.title}</h1>

        <div>
            {details.beginDate}
        </div>

        <div>
            {location.name}
        </div>

        <div>
            {JSON.stringify(details)}
        </div>
    </div>
);

export default EventPage;