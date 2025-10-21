import type { ReactNode } from 'react'

export const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-slate-100">
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8">{children}</div>
  </div>
)

