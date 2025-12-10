export function Background({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-hero min-h-screen flex flex-col relative">
      <div className="bg-card relative z-10">
        <div className="min-h-screen flex-1 flex flex-col relative pb-10 z-20">
          {children}
        </div>
      </div>
    </div>
  );
}
