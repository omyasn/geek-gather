import * as React from 'react';
import cn from 'classnames';
import Text from '../../../components/CoreComponents/Text';
import styles from './styles.scss';
import {
    faPeoplePulling,
    faMagnifyingGlassArrowRight,
    faCircleInfo,
    faArrowsDownToPeople,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface Props {
    icon: IconProp
    title: string;
    text: string;
}

const advantages = [{
    icon: faMagnifyingGlassArrowRight,
    title: 'Find interesting events',
    text: 'Search throught events all over the world with convenient and rich filters.'
}, {
    icon: faCircleInfo,
    title: 'Read full information',
    text: 'We gather information from various sources, combine it and display in convenient format.'
},{
    icon: faArrowsDownToPeople,
    title: 'We support you',
    text: `Don't understand something? Don't want to go to your first game alone? Contact us, and we can solve it together!`
},{
    icon: faPeoplePulling,
    title: 'Organize your own event',
    text: 'Create your event and other people will join.'
}]

const AdvantageCard: React.FC<Props> = ({
    title,
    text,
    icon,
}) => (
    <div className={cn(styles.cardWrapper)}>
        <FontAwesomeIcon className={styles.icon} icon={icon} />
        <div className={styles.text}>
            <Text block header textSize='s'>{title}</Text>
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