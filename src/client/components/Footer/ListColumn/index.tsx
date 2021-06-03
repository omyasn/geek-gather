import * as React from 'react';
import cn from 'classnames';

import styles from './styles.css';

interface Props {
    className?: string;
    title?: string;
    listItems: ListItem[];
}

interface ListItem {
    name: string;
    title: string;
    url: string;
}

const ListColumn: React.FC<Props> = ({ className, title, listItems }) => (
    <div className={cn(styles.list, className)}>
        {!title ? '' :
            <div className={styles.title}>{title}</div>
        }
        {listItems.map(listItem => (
            <a
                key={listItem.name}
                href={listItem.url}
                className={styles.item}
            >
                {listItem.title}
            </a>
        ))}
    </div>
);

export default ListColumn;