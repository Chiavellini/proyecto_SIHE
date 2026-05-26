export default function MaterialIcon({ name, className = '', filled = false, title }) {
  return (
    <span
      aria-hidden={title ? undefined : 'true'}
      aria-label={title}
      className={`material-symbols-${filled ? 'rounded' : 'outlined'} ${className}`.trim()}
    >
      {name}
    </span>
  );
}
