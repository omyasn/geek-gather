import * as React from 'react';
import cn from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    IconDefinition,
    faSearch,
    faCalendarDay,
    faBaseballBall,
    faFingerprint,
} from '@fortawesome/free-solid-svg-icons';
import logo from './logo.png';
import styles from './styles.css';

interface NavItem {
    title: string;
    name: string;
    icon: IconDefinition;
    link: string;
    className?: string;
};

interface Props {
    className?: string;
    navItems: NavItem[];
    
}

const defaultNavigation: NavItem[] = [{
        title: 'Поиск',
        name: 'search',
        icon: faSearch,
        link: '/search',
    }, {
        title: 'Календарь',
        name: 'calendar',
        icon: faCalendarDay,
        link: '/calendar',
    }, {
        title: 'Основы',
        name: 'basics',
        icon: faBaseballBall,
        link: '/basics',
    }, {
        title: 'О нас',
        name: 'about',
        icon: faFingerprint,
        link: '/about',
        className: styles.hideOnSmall,
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
                    className={cn(styles.navItem, navItem.className)}
                    key={navItem.name}
                    href={navItem.link}
                >
                    <FontAwesomeIcon
                        className={styles.navIcon}
                        icon={navItem.icon}
                    />
                    <span className={styles.navTitle}>
                        {navItem.title}
                    </span>
                </a>
            ))}
        </nav>
    </header>
);

export default Header;