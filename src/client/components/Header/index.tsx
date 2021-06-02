import * as React from 'react';
import cn from 'classnames';

import logo from './logo.png';

import styles from './styles.css';

interface NavItem {
    title: string;
    name: string;
    icon: string;
    link: string;
};

interface Props {
    className?: string;
    navItems: NavItem[];
    
}

const defaultNavigation: NavItem[] = [{
        title: 'Поиск',
        name: 'search',
        icon: '',
        link: '/search',
    }, {
        title: 'Календарь',
        name: 'calendar',
        icon: '',
        link: '/calendar',
    }, {
        title: 'Основы',
        name: 'basics',
        icon: '',
        link: '/basics',
    }, {
        title: 'О нас',
        name: 'about',
        icon: '',
        link: '/about',
    }
];

const Header: React.FC<Props> = ({
    className,
    navItems = defaultNavigation,
}) => (
    <header className={cn(styles.header, className)}>
        <a className={styles.group} href='/' >
            <img className={styles.logo} src={logo} alt='logo geekGather' />
            <div className={styles.title}>geekGather</div>
        </a>
        <nav className={styles.group}>
            {navItems.map(navItem => (
                <a
                    className={styles.navItem}
                    key={navItem.name}
                    href={navItem.link}
                >
                    {
                    //icon use font awesome
                    }
                    {navItem.title}
                </a>
            ))}
        </nav>
    </header>
);

export default Header;