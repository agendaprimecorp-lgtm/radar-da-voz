'use client'

interface TalentCardCompactProps {
  name: string
  specialty: string
  rating: number
  carisma: number
  naturalidade: number
  tecnica: number
  scoreGeral: number
  isSelected: boolean
  onSelect: () => void
}

export function TalentCardCompact({
  name,
  specialty,
  rating,
  carisma,
  naturalidade,
  tecnica,
  scoreGeral,
  isSelected,
  onSelect,
}: TalentCardCompactProps) {
  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-lg cursor-pointer transition ${
        isSelected
          ? 'bg-primary-600 border-2 border-primary-500'
          : 'bg-dark-800 border border-dark-700 hover:border-primary-500'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold text-sm">{name}</h4>
          <p className="text-xs text-dark-400">{specialty}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-primary-500">{scoreGeral.toFixed(1)}</div>
          <div className="text-xs text-dark-400">Score</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="text-center p-2 bg-dark-700 rounded">
          <div className="font-semibold">{carisma.toFixed(1)}</div>
          <div className="text-dark-500">Carisma</div>
        </div>
        <div className="text-center p-2 bg-dark-700 rounded">
          <div className="font-semibold">{naturalidade.toFixed(1)}</div>
          <div className="text-dark-500">Natural.</div>
        </div>
        <div className="text-center p-2 bg-dark-700 rounded">
          <div className="font-semibold">{tecnica.toFixed(1)}</div>
          <div className="text-dark-500">Técnica</div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-dark-400">⭐ {rating.toFixed(1)}</span>
        {isSelected && <span className="text-primary-300">✓ Selecionado</span>}
      </div>
    </div>
  )
}
