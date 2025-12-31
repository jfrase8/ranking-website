import { useNavigate } from '@tanstack/react-router'

import { useState } from 'react'
import { ClipboardType, Home, Menu, Network, X } from 'lucide-react'
import { Button } from './ui/button'

const navItems = [
  {
    label: 'Home',
    href: '/',
    icon: Home,
  },
  {
    label: 'Numbered List',
    href: '/ranking/numbered-list',
    icon: Network,
  },
  {
    label: 'Tier List',
    href: '/ranking/tier-list',
    icon: ClipboardType,
  },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="h-18">
      <header className="p-4 flex items-center bg-linear-to-r from-indigo-950 to-indigo-800 text-white shadow-lg">
        <Button size="icon-lg" variant="ghost" onClick={() => setIsOpen(true)}>
          <Menu />
        </Button>
        <h1 className="ml-4 text-xl font-semibold">
          <Button size="lg" variant="ghost" onClick={() => navigate({ to: '/' })}>
            Ranking Website
          </Button>
        </h1>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-indigo-950 border-r-3 rounded-tr-lg border-indigo-500 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Navigation</h2>
          <Button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            variant="ghost"
            size="icon-lg"
          >
            <X size={24} />
          </Button>
        </div>

        <nav className="flex flex-col p-4 overflow-y-auto">
          {navItems.map(({ href, label, icon }) => (
            <Button
              variant="ghost"
              onClick={() => {
                navigate({ to: href })
                setIsOpen(false)
              }}
              className="justify-start py-6"
              key={href}
            >
              {label}
            </Button>
          ))}
        </nav>
      </aside>
    </div>
  )
}
