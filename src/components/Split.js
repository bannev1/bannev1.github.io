// Splits text into characters so GSAP can animate each one. Screen readers get the full text.
export default function Split({ text, className = '' }) {
  return (
    <span className={`split ${className}`} aria-label={text}>
      {[...text].map((c, i) => (
        <span className="ch-wrap" key={i} aria-hidden="true">
          <span className="ch">{c === ' ' ? '\u00A0' : c}</span>
        </span>
      ))}
    </span>
  );
}
