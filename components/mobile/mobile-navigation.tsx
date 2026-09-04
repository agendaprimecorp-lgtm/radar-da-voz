'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function MobileNavigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: '/talents', label: 'Talentos', icon: '👤' },
    { href: '/jobs', label: 'Vagas', icon: '💼' },
    { href: '/campaigns', label: 'Campanhas', icon: '📢' },
    { href: '/messages', label: 'Mensagens', icon: '💬' },
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-dark-700 md:hidden z-40">
        <div className="flex justify-around items-center h-20">
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full text-xs ${
                isActive(item.href) ? 'text-primary-500 border-t-2 border-primary-500' : 'text-dark-400'
              }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col items-center justify-center w-full h-full text-dark-400 text-xs"
          >
            <span className="text-2xl mb-1">☰</span>
            <span>Mais</span>
          </button>
        </div>
      </nav>

      {/* Sidebar Menu (Desktop) */}
      <nav className="hidden md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:bg-dark-800 md:border-r md:border-dark-700 md:flex md:flex-col md:z-40">
        <div className="p-6 border-b border-dark-700">
          <h1 className="text-2xl font-bold">🎤 Radar da Voz</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive(item.href)
                  ? 'bg-primary-500 text-white'
                  : 'text-dark-300 hover:bg-dark-700'
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-dark-700">
          <Link
            href="/settings"
            className="block px-4 py-3 rounded-lg text-dark-300 hover:bg-dark-700 transition-colors"
          >
            <span className="text-xl mr-3">⚙️</span>
            Configurações
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30" onClick={() => setIsOpen(false)} />
      )}

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="fixed bottom-20 left-0 right-0 bg-dark-800 rounded-t-2xl shadow-lg md:hidden z-40 max-h-96 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Menu</h2>
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg ${
                    isActive(item.href)
                      ? 'bg-primary-500 text-white'
                      : 'text-dark-300 hover:bg-dark-700'
                  }`}
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <hr className="my-4 border-dark-700" />
              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg text-dark-300 hover:bg-dark-700"
              >
                <span className="text-lg mr-3">⚙️</span>
                Configurações
              </Link>
              <Link
                href="/help"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg text-dark-300 hover:bg-dark-700"
              >
                <span className="text-lg mr-3">❓</span>
                Ajuda
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
