import * as React from 'react';
import cn from 'classnames';

import Text from '../Text';

import styles from './styles.scss';

interface Props {
    image: string;
    title?: string; 
    className?: string;
    onClick?: React.MouseEventHandler;
    openable?: boolean;
}

const ThumbnailCard: React.FC<Props> = ({
    children,
    image,
    title,
    className,

    onClick,
    openable,
}) => (
    <div className={cn(styles.wrapper, className)}>
        <img src={image} className={styles.image} />
        <div className={''}>
            {!title ? '' : 
                <Text header block>{title}</Text>
            }
            <Text>
                {children}
            </Text>
        </div>
    </div>
);

export default ThumbnailCard;