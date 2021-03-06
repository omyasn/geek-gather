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
import Link from '../CoreComponents/Link';
import logo from './logo.png';
import styles from './styles.scss';

interface NavItem {
    title: string;
    name: string;
    icon: IconDefinition;
    url: string;
    className?: string;
};

interface Props {
    className?: string;
    navItems?: NavItem[];
}

const defaultNavigation: NavItem[] = [{
        title: 'Search',
        name: 'search',
        icon: faSearch,
        url: '/search',
    }, {
        title: 'Calendar',
        name: 'calendar',
        icon: faCalendarDay,
        url: '/calendar',
    }, {
        title: 'Basics',
        name: 'basics',
        icon: faBaseballBall,
        url: '/basics',
    }, {
        title: 'About',
        name: 'about',
        icon: faFingerprint,
        url: '/about',
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
                <Link
                    className={cn(styles.navItem, navItem.className)}
                    key={navItem.name}
                    href={navItem.url}
                >
                    <FontAwesomeIcon
                        className={styles.navIcon}
                        icon={navItem.icon}
                    />
                    <span className={styles.navTitle}>
                        {navItem.title}
                    </span>
                </Link>
            ))}
        </nav>
    </header>
);

export default Header;