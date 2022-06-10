import * as React from 'react';
import { EventType } from '../../../common/commonTypes';
import cn from 'classnames';
import styles from './styles.scss'
import Text from '../../components/CoreComponents/Text';


const SearchCard: React.FC<EventType> = ({
    title,
    id,
    beginDate,
    capacity,
    minPrice,
    owner,
    location,
    city,
    parties
}) => {
    return (
        <div className={styles.wrapper}>
            <Text header textSize="xs" block>{`${title} (${id})`}</Text>
            <div>{beginDate}</div>
            <div>Capacity: {capacity}</div>
            <div>MinPrice: {minPrice}</div>
            <div>Owner: {owner}</div>
            <div>Location: {location}</div>
            <div>City: {city}</div>
            <div>Parties: {parties}</div>
        </div>
    );
};

export default SearchCard;