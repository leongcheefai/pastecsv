"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"

const themes = [
  { value: "system", icon: Monitor, label: "System" },
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
] as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="size-8 p-0" disabled>
        <Monitor className="size-3.5" />
      </Button>
    )
  }

  const current = themes.find((t) => t.value === theme) ?? themes[0]
  const next = themes[(themes.findIndex((t) => t.value === theme) + 1) % themes.length]

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(next.value)}
      className="size-8 p-0"
      title={`Theme: ${current.label} (click for ${next.label})`}
    >
      <current.icon className="size-3.5" />
    </Button>
  )
}
