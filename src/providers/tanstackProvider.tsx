"use client"
import {  QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import React from "react"
import { getQueryClient } from "@/lib/tanstack/query-clients"

export function TanstackProvider({ children }: { children: React.ReactNode }) {
  const qc = getQueryClient()
  return (
    <QueryClientProvider client={qc}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}