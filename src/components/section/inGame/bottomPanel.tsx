export default function BottomPanel({ tableName, bigBlind, smallBlind }: { tableName: string; bigBlind: number; smallBlind: number }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface-panel border-t border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-white font-semibold">
            Table: {tableName}
          </span>
          <span className="text-brand-accent text-sm">
            Blinds: ${bigBlind}/${smallBlind}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-primary-red hover:bg-primary-red/80 text-white rounded-lg transition-colors">
            Fold
          </button>
          <button className="px-4 py-2 bg-brand-accent hover:bg-brand-accent/80 text-white rounded-lg transition-colors">
            Call
          </button>
          <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors">
            Raise
          </button>
        </div>
      </div>
    </div>
  );
}
