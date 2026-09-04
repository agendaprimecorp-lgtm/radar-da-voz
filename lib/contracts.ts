import { createClient } from '@supabase/supabase-js'
import PDFDocument from 'pdfkit'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface ContractTemplate {
  id: string
  name: string
  description: string
  template_html: string
  variables: string[]
}

export interface Contract {
  id: string
  title: string
  status: 'draft' | 'pending' | 'signed' | 'declined' | 'expired'
  initiator_id: string
  counterparty_id: string
  content: string
  pdf_url?: string
  created_at: string
  due_date?: string
  signed_date?: string
}

export interface ContractSignature {
  id: string
  contract_id: string
  signer_id: string
  status: 'pending' | 'signed' | 'declined'
  signed_at?: string
  signature_data?: string
}

// Obter templates de contrato
export async function getContractTemplates(): Promise<ContractTemplate[]> {
  try {
    const { data, error } = await supabase
      .from('contract_templates')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw new Error(error.message)
    return data || []
  } catch (error: any) {
    console.error('Failed to get contract templates:', error)
    return []
  }
}

// Obter template específico
export async function getContractTemplate(id: string): Promise<ContractTemplate | null> {
  try {
    const { data, error } = await supabase
      .from('contract_templates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)
    return data
  } catch (error: any) {
    console.error('Failed to get contract template:', error)
    return null
  }
}

// Gerar contrato a partir de template
export async function generateContract(
  organizationId: string,
  templateId: string,
  title: string,
  initiatorId: string,
  counterpartyId: string,
  variables: Record<string, any>,
  dueDate?: string
): Promise<Contract | null> {
  try {
    // Obter template
    const template = await getContractTemplate(templateId)
    if (!template) throw new Error('Template not found')

    // Substituir variáveis no template
    let content = template.template_html
    Object.entries(variables).forEach(([key, value]) => {
      content = content.replace(`{${key}}`, String(value))
    })

    // Criar contrato
    const { data, error } = await supabase
      .from('contracts')
      .insert({
        organization_id: organizationId,
        template_id: templateId,
        title,
        initiator_id: initiatorId,
        counterparty_id: counterpartyId,
        content,
        variables,
        due_date: dueDate,
        status: 'draft',
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    // Log audit
    await logContractEvent(data.id, initiatorId, 'created', { title })

    return data
  } catch (error: any) {
    console.error('Failed to generate contract:', error)
    return null
  }
}

// Enviar contrato para assinatura
export async function sendContractForSignature(
  contractId: string,
  initiatorId: string
): Promise<boolean> {
  try {
    // Atualizar status
    const { error: updateError } = await supabase
      .from('contracts')
      .update({ status: 'pending' })
      .eq('id', contractId)

    if (updateError) throw new Error(updateError.message)

    // Criar entry de assinatura para counterparty
    const contract = await getContract(contractId)
    if (!contract) throw new Error('Contract not found')

    const { error: sigError } = await supabase
      .from('contract_signatures')
      .insert({
        contract_id: contractId,
        signer_id: contract.counterparty_id,
        status: 'pending',
      })

    if (sigError) throw new Error(sigError.message)

    // Log audit
    await logContractEvent(contractId, initiatorId, 'sent', {})

    // TODO: Enviar email para counterparty com link de assinatura

    return true
  } catch (error: any) {
    console.error('Failed to send contract for signature:', error)
    return false
  }
}

// Assinar contrato
export async function signContract(
  contractId: string,
  signerId: string,
  signatureData?: string,
  ipAddress?: string,
  userAgent?: string
): Promise<boolean> {
  try {
    const now = new Date().toISOString()

    // Atualizar assinatura
    const { error: sigError } = await supabase
      .from('contract_signatures')
      .update({
        signer_id: signerId,
        status: 'signed',
        signed_at: now,
        signature_data: signatureData,
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .eq('contract_id', contractId)
      .eq('signer_id', signerId)

    if (sigError) throw new Error(sigError.message)

    // Verificar se todas as partes assinaram
    const { data: signatures } = await supabase
      .from('contract_signatures')
      .select('status')
      .eq('contract_id', contractId)

    const allSigned = signatures?.every((sig) => sig.status === 'signed')

    if (allSigned) {
      // Atualizar status do contrato
      await supabase
        .from('contracts')
        .update({ status: 'signed', signed_date: now })
        .eq('id', contractId)
    }

    // Log audit
    await logContractEvent(contractId, signerId, 'signed', {})

    return true
  } catch (error: any) {
    console.error('Failed to sign contract:', error)
    return false
  }
}

// Rejeitar contrato
export async function declineContract(
  contractId: string,
  signerId: string,
  reason: string
): Promise<boolean> {
  try {
    // Atualizar assinatura
    const { error: sigError } = await supabase
      .from('contract_signatures')
      .update({
        status: 'declined',
        declined_reason: reason,
      })
      .eq('contract_id', contractId)
      .eq('signer_id', signerId)

    if (sigError) throw new Error(sigError.message)

    // Atualizar contrato
    await supabase
      .from('contracts')
      .update({
        status: 'declined',
        declined_date: new Date().toISOString(),
        declined_reason: reason,
      })
      .eq('id', contractId)

    // Log audit
    await logContractEvent(contractId, signerId, 'declined', { reason })

    return true
  } catch (error: any) {
    console.error('Failed to decline contract:', error)
    return false
  }
}

// Obter contrato
export async function getContract(id: string): Promise<Contract | null> {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)
    return data
  } catch (error: any) {
    console.error('Failed to get contract:', error)
    return null
  }
}

// Listar contratos do usuário
export async function getUserContracts(userId: string): Promise<Contract[]> {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .or(`initiator_id.eq.${userId},counterparty_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  } catch (error: any) {
    console.error('Failed to get user contracts:', error)
    return []
  }
}

// Obter assinaturas de um contrato
export async function getContractSignatures(contractId: string): Promise<ContractSignature[]> {
  try {
    const { data, error } = await supabase
      .from('contract_signatures')
      .select('*')
      .eq('contract_id', contractId)

    if (error) throw new Error(error.message)
    return data || []
  } catch (error: any) {
    console.error('Failed to get contract signatures:', error)
    return []
  }
}

// Gerar PDF do contrato
export async function generateContractPDF(contract: Contract): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument()
      const chunks: Buffer[] = []

      doc.on('data', (chunk) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      // Título
      doc.fontSize(24).font('Helvetica-Bold').text(contract.title, { align: 'center' })
      doc.moveDown()

      // Data
      doc.fontSize(10).font('Helvetica').text(`Criado em: ${new Date(contract.created_at).toLocaleDateString('pt-BR')}`, {
        align: 'left',
      })
      doc.moveDown()

      // Conteúdo
      doc.fontSize(12).text(contract.content.replace(/<[^>]*>/g, ''), { align: 'justify' })
      doc.moveDown(2)

      // Assinaturas
      doc.fontSize(10).text('_________________________', { align: 'left' })
      doc.text('Assinatura Iniciador', { align: 'left' })
      doc.moveDown()

      doc.fontSize(10).text('_________________________', { align: 'right' })
      doc.text('Assinatura Contraparte', { align: 'right' })

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

// Log de auditoria
async function logContractEvent(
  contractId: string,
  userId: string,
  eventType: string,
  eventData: any,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    await supabase.from('contract_audit_logs').insert({
      contract_id: contractId,
      user_id: userId,
      event_type: eventType,
      event_data: eventData,
      ip_address: ipAddress,
      user_agent: userAgent,
    })
  } catch (error) {
    console.error('Failed to log contract event:', error)
  }
}

// Obter histórico de auditoria
export async function getContractAuditLog(contractId: string) {
  try {
    const { data, error } = await supabase
      .from('contract_audit_logs')
      .select('*')
      .eq('contract_id', contractId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  } catch (error: any) {
    console.error('Failed to get audit log:', error)
    return []
  }
}
