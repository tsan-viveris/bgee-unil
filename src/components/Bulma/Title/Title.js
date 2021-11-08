import React from 'react';
import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const Title = ({
  children,
  className,
  size,
  subtitle,
  weight,
  spaced,
  heading,
  ...props
}) => (
  <Element
    {...props}
    className={classnames(
      className,
      {
        title: !subtitle && !heading,
        subtitle,
        heading,
        [`is-${size}`]: size,
        [`has-text-weight-${weight}`]: weight,
        'is-spaced': spaced && !subtitle,
      },
      'has-text-primary'
    )}
  >
    {children}
  </Element>
);

Title.defaultProps = {
  renderAs: 'h1',
};

export default Title;
