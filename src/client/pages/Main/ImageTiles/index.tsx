import * as React from 'react';
import cn from 'classnames';
import Text from '../../../components/CoreComponents/Text';
import styles from './styles.scss';

interface Props {
    image: string;
    title: string;
    link: string;
    className?: string;
    darkText?: boolean; 
}

const ImageTiles: React.FC<Props> = ({
    className,
    image,
    title,
    link,
    darkText,
    ...rest
}) => (
    <a href={link} className={cn(styles.wrapper, className)} {...rest}>
        <img src={image} className={styles.image} />
        <div className={cn(styles.content, { [styles.darkText]: darkText })}>
            <Text block textSize='xl'>{title}</Text>
        </div>
    </a>
);

export default ImageTiles;