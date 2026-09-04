import { validate, emailSchema, passwordSchema, sanitizeInput } from '@/lib/validation'

describe('Validation', () => {
  describe('emailSchema', () => {
    it('deve validar email válido', () => {
      const result = validate(emailSchema, 'test@example.com')
      expect(result.success).toBe(true)
    })

    it('deve rejeitar email inválido', () => {
      const result = validate(emailSchema, 'invalid-email')
      expect(result.success).toBe(false)
    })

    it('deve rejeitar email vazio', () => {
      const result = validate(emailSchema, '')
      expect(result.success).toBe(false)
    })
  })

  describe('passwordSchema', () => {
    it('deve validar senha forte', () => {
      const result = validate(passwordSchema, 'StrongPass123!')
      expect(result.success).toBe(true)
    })

    it('deve rejeitar senha sem maiúscula', () => {
      const result = validate(passwordSchema, 'weakpass123!')
      expect(result.success).toBe(false)
    })

    it('deve rejeitar senha sem número', () => {
      const result = validate(passwordSchema, 'WeakPass!')
      expect(result.success).toBe(false)
    })

    it('deve rejeitar senha muito curta', () => {
      const result = validate(passwordSchema, 'Pass1!')
      expect(result.success).toBe(false)
    })
  })

  describe('sanitizeInput', () => {
    it('deve remover scripts', () => {
      const input = '<script>alert("xss")</script>Hello'
      const result = sanitizeInput(input)
      expect(result).not.toContain('<script>')
      expect(result).toContain('Hello')
    })

    it('deve remover HTML tags', () => {
      const input = '<p>Hello</p> <b>World</b>'
      const result = sanitizeInput(input)
      expect(result).not.toContain('<p>')
      expect(result).not.toContain('<b>')
    })

    it('deve limitar tamanho', () => {
      const input = 'x'.repeat(2000)
      const result = sanitizeInput(input)
      expect(result.length).toBeLessThanOrEqual(1000)
    })

    it('deve trimmar espaços', () => {
      const input = '   Hello World   '
      const result = sanitizeInput(input)
      expect(result).toBe('Hello World')
    })
  })
})
