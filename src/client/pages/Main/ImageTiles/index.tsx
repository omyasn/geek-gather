import * as React from 'react';
import cn from 'classnames';
import Text from '../../../components/CoreComponents/Text';
import styles from './styles.scss';
import moscow from '../images/moscow.jpg';
import june from '../images/june.jpg';
import restricted from '../images/restricted.jpg';

interface Props {
    image: string;
    title: string;
    link: string;
    className?: string;
    darkText?: boolean; 
}

const getMonthQuery = () => {
    const currentMonth = new Intl.DateTimeFormat('en-GB', { month: '2-digit' }).format(new Date())
    let query = `2022-${currentMonth}-01`;
    for (let i = 2; i < 32; i++) {
        const day = i > 9 ? i : `0${i}`;
        query = query + `,2022-${currentMonth}-${day}`;
    }
    return query;
}

const getMonthName = () => (
    new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(new Date())
)

const tiles = [{
    image: restricted,
    title: 'by Restricted Area',
    link: '/search?owner=Restricted+Area',
  }, {
    image: june,
    title: `in ${getMonthName()}`,
    link: `/search?beginDate=${getMonthQuery()}`,
  }, {
    image: moscow,
    title: 'in Moscow',
    link: '/search?city=Moscow',
    darkText: true,
  }, {
    image: '',
    title: '... or your own choice',
    link: '/search',
    darkText: true,
  }]

const ImageTile: React.FC<Props> = ({
    className,
    image,
    title,
    link,
    darkText,
    ...rest
}) => (
    <a href={link} className={cn(styles.wrapper, className)} {...rest}>
        {image && <img src={image} className={styles.image} />}
        <div className={cn(styles.content, { [styles.darkText]: darkText })}>
            <Text block textSize='xl'>{title}</Text>
        </div>
    </a>
);

const ImageTiles = () => (
    <div className={styles.tiles}>
        {tiles.map((tile) => (
            <ImageTile {...tile} key={tile.title} />
        ))}
    </div>
);

export default ImageTiles;