import { create } from 'zustand'

export type SchemaField = {
  id: string
  name: string
  description: string
}

type SchemaStore = {
  schema: SchemaField[]
  setSchema: (schema: SchemaField[]) => void
  addField: (field: SchemaField) => void
  removeField: (id: string) => void
  updateField: (id: string, updates: Partial<SchemaField>) => void
}

export const useSchemaStore = create<SchemaStore>((set) => ({
  schema: [
    { id: '1', name: 'Company', description: 'Company name' },
    { id: '2', name: 'Description', description: 'Company description' },
    { id: '3', name: 'URL', description: 'Company URL' },
    { id: '4', name: 'Industry', description: 'Company industry' },
    { id: '5', name: 'Traction', description: 'Summary of company traction, including revenue, users, and growth' },
    { id: '6', name: 'Ask', description: 'Amount of funding requested and valuation' },
  ],
  setSchema: (schema) => set({ schema }),
  addField: (field) => set((state) => ({ schema: [...state.schema, field] })),
  removeField: (id) => set((state) => ({ 
    schema: state.schema.filter((field) => field.id !== id) 
  })),
  updateField: (id, updates) => set((state) => ({
    schema: state.schema.map((field) => 
      field.id === id ? { ...field, ...updates } : field
    )
  })),
})) 