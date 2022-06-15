import * as React from 'react';
import cn from 'classnames';

import Link from '../CoreComponents/Link';

import styles from './styles.scss';

interface Props {
    className?: string;
}

const listItems = [{
        title: 'Search',
        name: 'search',
        url: '/search',
    }, {
        title: 'Event calendar',
        name: 'calendar',
        url: '/calendar',
    }, {
        title: 'Basic information',
        name: 'basics',
        url: '/basics',
    }, {
        title: 'About',
        name: 'about',
        url: '/about',
    }
];

const Footer: React.FC<Props> = ({ className }) => (
    <footer className={cn(styles.footer, className)}>
        <div className={styles.nav}>
            {listItems.map(listItem => (
                <Link 
                    key={listItem.name}
                    href={listItem.url}
                    className={styles.navItem}
                >
                    {listItem.title}
                </Link>
            ))}
        </div>
        <div className={styles.copy}>&#169; All rights reserved</div>
    </footer>
);

export default Footer;