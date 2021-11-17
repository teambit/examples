import React from 'react';
import classNames from 'classnames';
import styles from './heading.module.scss';

export function Heading({ children, element, className }) {
  const Element = element || 'h1';
  return (
    <Element className={classNames(styles.heading, className)}>
      {children}
    </Element>
  );
}
