import * as React from 'react';
import cn from 'classnames';

import Text from '../Text';
import styles from './styles.scss';

interface Props extends React.HTMLProps<HTMLAnchorElement> {
    href: string;
    className?: string;
}

const Link: React.FC<Props> = ({ className, children,...rest }) => (
    <Text
        tag='a'
        className={cn(styles.link, className)}
        {...rest}
    >
        {children}
    </Text>
);

export default Link;