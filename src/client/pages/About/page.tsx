import * as React from 'react';

import ThumbnailCard from '../../components/CoreComponents/ThumbnailCard';
import Text from '../../components/CoreComponents/Text';
import TopImage from '../../components/TopImage';

import Dinn from './images/dinn.jpg';
import Olga from './images/olga.jpg';
import bg from './images/leaves.jpg';

import styles from './styles.scss';

const AboutPage: React.FC = ({

}) => (
    <div className={styles.wrapper}>
        <TopImage
            image={bg}
            title='О нас'
            subTitle='Кто мы и какая наша история, а также контакты'
            className={styles.topImage}
        />

        <div className={styles.cards}>
            <ThumbnailCard
                image={Dinn}
                title='Dinn Diallo'
                className={styles.card}
            >
                All about Dinn
            </ThumbnailCard>

            <ThumbnailCard
                image={Olga}
                title='Olga Myasnikova'
                className={styles.card}
            >
                All about Olga
            </ThumbnailCard>
        </div>

        <Text block className={styles.story}>
            Наша история <p>создания</p> сайта &#176;
        </Text>
    </div>
);

export default AboutPage;