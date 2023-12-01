export function CardsList({ children }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, 350px)',
        justifyItems: 'center',
        gap: '40px'
      }}
    >
      {children}
    </div>
  );
}

export function CardItem({ children, ...props }) {
  return (
    <div
      {...props}
      style={{
        boxShadow: '0 1px 6px #33333320',
        width: '100%',
        padding: '16px',
        backgroundColor: 'white'
      }}
    >
      {children}
    </div>
  );
}
