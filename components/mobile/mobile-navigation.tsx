'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Users,
  Briefcase,
  Menu,
  X,
  Settings,
  Home
} from '@/components/icons/HeroIcons'

export function MobileNavigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: '/talents', label: 'Talentos', icon: Users },
    { href: '/jobs', label: 'Vagas', icon: Briefcase },
    { href: '/campaigns', label: 'Campanhas', icon: () => <span>📢</span> },
    { href: '/messages', label: 'Mensagens', icon: () => <span>💬</span> },
    { href: '/dashboard', label: 'Dashboard', icon: Home },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-dark-700 md:hidden z-40 h-16">
        <div className="flex justify-around items-center h-full">
          {navItems.slice(0, 4).map((item) => {
            const IconComponent = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full text-xs transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-primary-500 border-t-2 border-primary-500'
                    : 'text-dark-400 hover:text-dark-300'
                }`}
              >
                <IconComponent size={24} strokeWidth={2} className="mb-1" />
                <span className="text-xs truncate">{item.label}</span>
              </Link>
            )
          })}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col items-center justify-center w-full h-full text-dark-400 hover:text-dark-300 text-xs transition-colors duration-200"
          >
            <Menu size={24} strokeWidth={2} className="mb-1" />
            <span>Mais</span>
          </button>
        </div>
      </nav>

      {/* Sidebar Menu (Desktop) */}
      <nav className="hidden md:fixed md:left-0 md:top-0 md:h-screen md:w-56 md:bg-dark-800 md:border-r md:border-dark-700 md:flex md:flex-col md:z-40">
        <div className="p-6 border-b border-dark-700 flex items-center gap-3">
          <Home size={28} className="text-primary-500" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            Radar da Voz
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const IconComponent = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg mb-2 transition-all duration-200 border-l-4 ${
                  isActive(item.href)
                    ? 'bg-primary-500/10 text-primary-400 border-l-primary-500'
                    : 'text-dark-300 hover:bg-dark-700 border-l-transparent hover:border-l-primary-500'
                }`}
              >
                <IconComponent size={20} strokeWidth={2} className="mr-3 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-dark-700">
          <Link
            href="/settings"
            className="flex items-center px-4 py-3 rounded-lg text-dark-300 hover:bg-dark-700 hover:text-dark-50 transition-all duration-200"
          >
            <Settings size={20} strokeWidth={2} className="mr-3" />
            <span className="font-medium">Configurações</span>
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30" onClick={() => setIsOpen(false)} />
      )}

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="fixed bottom-16 left-0 right-0 bg-dark-800 rounded-t-2xl shadow-xl md:hidden z-40 max-h-96 overflow-y-auto border-t border-dark-700">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Menu</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {navItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-primary-500/10 text-primary-400'
                        : 'text-dark-300 hover:bg-dark-700'
                    }`}
                  >
                    <IconComponent size={20} strokeWidth={2} className="mr-3 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
              <hr className="my-4 border-dark-700" />
              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-3 rounded-lg text-dark-300 hover:bg-dark-700 hover:text-dark-50 transition-colors"
              >
                <Settings size={20} strokeWidth={2} className="mr-3" />
                <span className="font-medium">Configurações</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
