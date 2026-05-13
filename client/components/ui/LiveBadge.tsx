export default function LiveBadge() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: 'rgba(255,50,50,0.15)', color: '#ff6060',
      fontSize: 10, padding: '2px 8px', borderRadius: 10,
      border: '1px solid rgba(255,50,50,0.3)',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: '#ff4444',
        display: 'inline-block', animation: 'pulse 1.5s infinite',
      }} />
      Live
    </span>
  );
}