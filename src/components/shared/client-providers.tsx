'use client'
import React from 'react'
import { Toaster } from '../ui/toaster'

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}