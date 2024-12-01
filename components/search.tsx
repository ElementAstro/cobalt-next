"use client"

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { useTranslations } from 'next-intl'

export function Search() {
  const [searchTerm, setSearchTerm] = useState('')
  const t = useTranslations('search')

  return (
    <div className="mb-8">
      <Input
        type="search"
        placeholder={t('placeholder')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm mx-auto"
      />
    </div>
  )
}

