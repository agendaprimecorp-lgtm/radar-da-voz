'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function PrivacyPage() {
  const [exporting, setExporting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleExportData = async () => {
    setExporting(true)
    try {
      const response = await fetch('/api/user/data-export', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) throw new Error('Erro ao exportar dados')

      const data = await response.json()

      // Baixar JSON
      const element = document.createElement('a')
      element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(data.data, null, 2))
      )
      element.setAttribute('download', `meus_dados_${new Date().toISOString()}.json`)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      toast.success('Dados exportados com sucesso!')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setExporting(false)
    }
  }

  const handleDeleteAccount = async (password: string) => {
    setDeleting(true)
    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) throw new Error('Erro ao deletar conta')

      toast.success('Conta deletada com sucesso')
      setTimeout(() => (window.location.href = '/'), 2000)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Privacidade & LGPD</h1>

        {/* LGPD Info */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Seus Direitos LGPD</h2>
          <p className="text-dark-400 mb-4">
            De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span>✓</span>
              <span><strong>Acesso:</strong> Solicitar uma cópia de seus dados pessoais</span>
            </li>
            <li className="flex gap-3">
              <span>✓</span>
              <span><strong>Correção:</strong> Corrigir dados inexatos ou incompletos</span>
            </li>
            <li className="flex gap-3">
              <span>✓</span>
              <span><strong>Exclusão:</strong> Solicitar a exclusão de seus dados (direito ao esquecimento)</span>
            </li>
            <li className="flex gap-3">
              <span>✓</span>
              <span><strong>Portabilidade:</strong> Receber seus dados em formato portável</span>
            </li>
          </ul>
        </div>

        {/* Export Data */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-4">📥 Exportar Meus Dados</h3>
          <p className="text-dark-400 mb-4">
            Baixe um arquivo JSON com todos os seus dados armazenados em conformidade com LGPD.
          </p>
          <Button
            onClick={handleExportData}
            disabled={exporting}
            variant="outline"
            className="w-full"
          >
            {exporting ? 'Exportando...' : '📥 Baixar Meus Dados'}
          </Button>
        </div>

        {/* Delete Account */}
        <div className="card border-red-900 bg-red-950">
          <h3 className="text-lg font-semibold mb-4 text-red-300">🗑️ Deletar Minha Conta</h3>
          <p className="text-dark-400 mb-4">
            Ao deletar sua conta, todos os seus dados pessoais serão removidos permanentemente do sistema.
            Esta ação não pode ser desfeita.
          </p>

          {!showDeleteConfirm ? (
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="destructive"
              className="w-full bg-red-900 hover:bg-red-800"
            >
              Deletar Minha Conta
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-dark-800 rounded-lg border border-red-700">
                <p className="font-semibold mb-2">⚠️ Ação Irreversível</p>
                <p className="text-sm text-dark-300 mb-4">
                  Digite sua senha para confirmar a exclusão da sua conta:
                </p>
                <input
                  type="password"
                  placeholder="Sua senha"
                  id="deletePassword"
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-dark-50 mb-4"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      const password = (
                        document.getElementById('deletePassword') as HTMLInputElement
                      )?.value
                      if (!password) {
                        alert('Digite sua senha')
                        return
                      }
                      handleDeleteAccount(password)
                    }}
                    disabled={deleting}
                    className="flex-1 bg-red-900"
                  >
                    {deleting ? 'Deletando...' : 'Confirmar Exclusão'}
                  </Button>
                  <Button
                    onClick={() => setShowDeleteConfirm(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Privacy Policy */}
        <div className="card mt-8 bg-dark-800">
          <h3 className="font-semibold mb-3">📋 Política de Privacidade</h3>
          <div className="text-sm text-dark-400 space-y-3">
            <p>
              <strong>Coleta de dados:</strong> Coletamos apenas dados necessários para funcionalidades da plataforma.
            </p>
            <p>
              <strong>Uso de dados:</strong> Seus dados são usados apenas para serviços solicitados e análise de
              segurança.
            </p>
            <p>
              <strong>Compartilhamento:</strong> Não compartilhamos dados com terceiros sem seu consentimento.
            </p>
            <p>
              <strong>Retenção:</strong> Dados são armazenados enquanto sua conta está ativa.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
