// Retained as a layout wrapper. MotionDirector owns the selective reveal layer.
export function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
