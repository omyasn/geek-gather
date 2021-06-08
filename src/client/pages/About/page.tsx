import * as React from 'react';

import ThumbnailCard from '../../components/CoreComponents/ThumbnailCard';
import Text from '../../components/CoreComponents/Text';
import TopImage from '../../components/TopImage';

import Dinn from './images/IMG_8643.jpg';
import Olga from './images/IMG_8658.jpg';
import bg from './images/leaves.jpg';

import styles from './styles.scss';

const AboutPage: React.FC = ({

}) => (
    <div className={styles.wrapper}>
        <TopImage
            image={bg}
            title='О нас'
            subTitle='Кто мы и какая наша история, а также контакты'
        />

        <ThumbnailCard
            image={Dinn}
            title='Dinn Diallo'
        >
            All about Dinn
        </ThumbnailCard>

        <ThumbnailCard
            image={Olga}
            title='Olga Myasnikova'
        >
            All about Olga
        </ThumbnailCard>
    </div>
);

export default AboutPage;