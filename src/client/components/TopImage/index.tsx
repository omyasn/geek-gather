import * as React from 'react';
import cn from 'classnames';

import Text from '../CoreComponents/Text';

import styles from './styles.scss';

interface Props {
    image: string;
    title: string;
    subTitle?: string;
    className?: string;
    light?: boolean; 
}

const TopImage: React.FC<Props> = ({
    className,
    image,
    title,
    subTitle,
    light,
    ...rest
}) => (
    <div className={cn(styles.wrapper, className, {[styles.light]: light})} {...rest}>
        <img src={image} className={styles.image} />
        <div className={styles.content}>
            <Text header block textSize='xl'>{title}</Text>
            {!subTitle ? '' : 
                <Text block textSize='xl'>{subTitle}</Text>
            }
        </div>
    </div>
);

export default TopImage;