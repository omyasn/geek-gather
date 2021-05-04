import * as React from 'react';
import { IHananaDetails, ILocation } from '../../../common/commonTypes';

export interface IPageProps {
    details: IHananaDetails;
    location: ILocation;
}

const EventPage: React.FC<IPageProps> = ({
    details,
    location,
}) => (
    <div>
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