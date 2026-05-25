import { Link } from 'react-router-dom';
import MaterialIcon from './MaterialIcon.jsx';

export default function ActionButton({
  children,
  className = '',
  disabled,
  href,
  icon,
  onClick,
  target,
  to,
  type = 'button',
  variant = 'primary',
}) {
  const content = (
    <>
      {icon ? <MaterialIcon name={icon} /> : null}
      <span>{children}</span>
    </>
  );
  const classes = `btn btn-${variant} ${className}`.trim();

  if (to) {
    return (
      <Link className={classes} to={to}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a className={classes} href={href} target={target} rel={target === '_blank' ? 'noreferrer' : undefined}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} disabled={disabled} type={type} onClick={onClick}>
      {content}
    </button>
  );
}
