import * as React from 'react';
import { EventType } from '../../../common/commonTypes';
import styles from './styles.scss'
import Text from '../../components/CoreComponents/Text';
import {
    faCalendarDay,
    faPeopleGroup,
    faRubleSign,
    faLocationDot,
    faPeopleArrowsLeftRight,
    faClipboardQuestion,
    faBowlingBall,
    faUsersViewfinder,
    faUserNinja,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatToHumanDate } from '../../../common/helpers'


const SearchCard: React.FC<EventType> = ({
    title,
    id,
    beginDate,
    capacity,
    minPrice,
    owner,
    location,
    city,
    parties,
    hasQuests,
    isPublic,
    allowedOwnBalls,
}) => {
    return (
        <a href={`/event/${id}`} className={styles.wrapper}>
            <div className={styles.header}>
                <Text className={styles.spacer} header textSize="xs">{title}</Text>
                <Text textSize="s">{`(${id})`}</Text>
            </div>
            <div className={styles.left}>
                <Text block>
                    <FontAwesomeIcon className={styles.spacer} icon={faCalendarDay} />
                    {formatToHumanDate(beginDate)}
                </Text>
                <Text block>
                    <FontAwesomeIcon className={styles.spacer} icon={faLocationDot} />
                    {`${location}, ${city}`}
                </Text>
                <Text block>
                    <FontAwesomeIcon className={styles.spacer} icon={faPeopleGroup} />
                    {`${capacity} players`}
                </Text>
                <Text block bold textSize="xl">
                    <span className={styles.text}>{`from ${minPrice}`}</span>
                    <FontAwesomeIcon icon={faRubleSign} />
                </Text>
            </div>
            <div className={styles.right}>
                <Text block>
                    <span className={styles.spacer}>Owner:</span>
                    <Text bold>{owner}</Text>
                </Text>
                <Text block>
                    <FontAwesomeIcon className={styles.spacer} icon={faPeopleArrowsLeftRight} />
                    {`Teams: ${parties}`}
                </Text>
                <div>
                    {!!isPublic ? 
                        <FontAwesomeIcon icon={faUsersViewfinder} title="Game by an organization" className={styles.icon} /> : 
                        <FontAwesomeIcon icon={faUserNinja} title="Game by a person" className={styles.icon} />
                    }
                    {!!allowedOwnBalls && <FontAwesomeIcon icon={faBowlingBall} title="Own balls allowed" className={styles.icon} />}
                    {!!hasQuests && <FontAwesomeIcon icon={faClipboardQuestion} title="Has quests" className={styles.icon} />}
                </div>
            </div>
        </a>
    );
};

export default SearchCard;