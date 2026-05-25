export default function SectionTitle({ align = 'left', strong, text }) {
  return (
    <div className={`section-title section-title-${align}`}>
      <h2>
        {text}
        {strong ? (
          <>
            {' '}
            <strong>{strong}</strong>
          </>
        ) : null}
      </h2>
    </div>
  );
}
