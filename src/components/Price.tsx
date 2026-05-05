interface PriceProps {
  value: number;
  className?: string;
}

export function formatPrice(n: number): [string, string] {
  const str = n.toFixed(2);
  const dot = str.indexOf('.');
  return [str.slice(0, dot), str.slice(dot)];
}

export default function Price({ value, className }: PriceProps) {
  const [whole, dec] = formatPrice(value);
  return (
    <span className={className}>
      {whole}<span className="price-dec">{dec}</span>
      {' '}<span className="price-unit">SAR</span>
    </span>
  );
}
