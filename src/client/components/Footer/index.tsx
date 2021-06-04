import * as React from 'react';
import cn from 'classnames';

import ListColumn from '../CoreComponents/ListColumn';
import Link from '../CoreComponents/Link';

import styles from './styles.css';

interface Props {
    className?: string;
}

const listItems = [{
        title: 'Поиск',
        name: 'search',
        url: '/search',
    }, {
        title: 'Календарь событий',
        name: 'calendar',
        url: '/calendar',
    }, {
        title: 'Общая информация',
        name: 'basics',
        url: '/basics',
    }, {
        title: 'О нас',
        name: 'about',
        url: '/about',
    }
];

const Footer: React.FC<Props> = ({ className }) => (
    <footer className={cn(styles.footer, className)}>
        {/* <ListColumn title="Сайт" listItems={listItems} /> */}
        <div className={styles.nav}>
            {listItems.map(listItem => (
                <Link 
                    key={listItem.name}
                    url={listItem.url}
                    className={styles.navItem}
                >
                    {listItem.title}
                </Link>
            ))}
        </div>
    </footer>
);

export default Footer;