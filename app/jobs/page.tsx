'use client'

import { useState, useEffect } from 'react'
import { JobPosting } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    specialty: '',
    location_city: '',
  })

  useEffect(() => {
    loadJobs()
  }, [filters])

  const loadJobs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.specialty) params.append('specialty', filters.specialty)
      if (filters.location_city) params.append('location_city', filters.location_city)

      const response = await fetch(`/api/jobs?${params}`)
      const data = await response.json()
      setJobs(data.jobs || [])
    } catch (error) {
      toast.error('Erro ao carregar vagas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold">Vagas Abertas</h1>

        {/* Filters */}
        <div className="card mb-8 space-y-4">
          <h2 className="text-lg font-semibold">Filtros</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              placeholder="Especialidade"
              onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
            />
            <Input
              placeholder="Cidade"
              onChange={(e) => setFilters({ ...filters, location_city: e.target.value })}
            />
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="text-center">Carregando vagas...</div>
        ) : jobs.length === 0 ? (
          <div className="card text-center">
            <p className="text-dark-400">Nenhuma vaga encontrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="card">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <p className="text-sm text-dark-400">{job.posted_by?.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary-500">
                      R$ {job.budget_min?.toLocaleString('pt-BR')} - R$ {job.budget_max?.toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>

                <p className="mb-4 text-dark-300">{job.description}</p>

                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-dark-700 px-3 py-1 text-xs">
                    {job.specialty_required}
                  </span>
                  {job.location_city && (
                    <span className="rounded-full bg-dark-700 px-3 py-1 text-xs">
                      {job.location_city}
                    </span>
                  )}
                </div>

                <Button className="w-full">Candidatar-se</Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
