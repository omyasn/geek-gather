import * as React from 'react';
import cn from 'classnames';
import styles from './styles.scss';
import Text from '../Text'

export type ClickableElement = HTMLButtonElement | HTMLAnchorElement;

interface Props extends React.HTMLAttributes<ClickableElement> {
    className?: string;
    href?: string;
}

const Button: React.FC<Props> = ({ className, children, href,...rest }) => {
    let inner = children
    if (typeof children === 'string') {
        inner = <Text>{children}</Text>
    }
    if (href) {
        return (
            <a
                className={cn(styles.button, className)}
                href={href}
                {...rest}
            >
                {inner}
            </a>
        );
    }
    
    return (
        <button
            className={cn(styles.button, className)}
            {...rest}
        >
            {inner}
        </button>
    );
};

export default Button;