'use client'

interface ComparisonViewProps {
  talents: any[]
  scores: { [key: string]: number }
  winner: any | null
  recommendation: string
}

export function ComparisonView({
  talents,
  scores,
  winner,
  recommendation,
}: ComparisonViewProps) {
  return (
    <div className="space-y-6">
      {/* Recomendação */}
      <div className="card border-2 border-primary-500 bg-primary-900">
        <h2 className="text-2xl font-bold mb-4">🎯 Recomendação</h2>
        <p className="text-lg text-primary-100">{recommendation}</p>
      </div>

      {/* Comparação lado-a-lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {talents.map((talent, idx) => (
          <div
            key={talent.id}
            className={`card ${
              winner?.id === talent.id ? 'ring-2 ring-primary-500 bg-primary-950' : ''
            }`}
          >
            <div className="mb-4">
              <h3 className="text-xl font-bold">{talent.name}</h3>
              <p className="text-dark-400 text-sm">{talent.specialty}</p>
              {winner?.id === talent.id && (
                <p className="text-primary-400 text-sm mt-1">⭐ Vencedor</p>
              )}
            </div>

            {/* Score Geral */}
            <div className="mb-4 p-4 bg-dark-800 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary-500 mb-1">
                {scores[talent.id].toFixed(1)}/10
              </div>
              <div className="text-xs text-dark-500">Score de Compatibilidade</div>
            </div>

            {/* Métricas */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-dark-400">Carisma</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-dark-700 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${(talent.carisma / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold w-8 text-right">
                    {talent.carisma.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-dark-400">Naturalidade</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-dark-700 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${(talent.naturalidade / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold w-8 text-right">
                    {talent.naturalidade.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-dark-400">Técnica</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-dark-700 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${(talent.tecnica / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold w-8 text-right">
                    {talent.tecnica.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-dark-700 flex justify-between">
              <span className="text-xs text-dark-400">⭐ Rating: {talent.rating}</span>
              <span className="text-xs text-dark-400">{talent.city}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
