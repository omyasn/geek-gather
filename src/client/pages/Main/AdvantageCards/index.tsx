import * as React from 'react';
import cn from 'classnames';
import Text from '../../../components/CoreComponents/Text';
import styles from './styles.scss';
import {
    faCalendarDay,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface Props {
    icon: IconProp
    title: string;
    text: string;
}

const advantages = [{
    icon: faCalendarDay,
    title: 'Find interesting events',
    text: 'Events all over the worls. Search with good filters.'
}, {
    icon: faCalendarDay,
    title: 'Find interesting events',
    text: 'Events all over the worls. Search with good filters.'
},{
    icon: faCalendarDay,
    title: 'Find interesting events',
    text: 'Events all over the worls. Search with good filters.'
},{
    icon: faCalendarDay,
    title: 'Find interesting events',
    text: 'Events all over the worls. Search with good filters.'
}]

const AdvantageCard: React.FC<Props> = ({
    title,
    text,
    icon,
}) => (
    <div className={cn(styles.cardWrapper)}>
        <FontAwesomeIcon className={styles.icon} icon={icon} />
        <div className={styles.text}>
            <Text block header>{title}</Text>
            <Text block>{text}</Text>
        </div>
    </div>
);

const AdvantageCards: React.FC = () => (
    <div className={cn(styles.wrapper)}>
        {advantages.map(card => (
            <AdvantageCard {...card} key={card.title} />
        ))}
    </div>
);



export default AdvantageCards;