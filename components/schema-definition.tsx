"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { X, Plus } from "lucide-react";

export interface SchemaField {
  id: string;
  name: string;
  description: string;
}

const defaultSchema: SchemaField[] = [
  { id: "1", name: "Company", description: "Company name" },
  { id: "2", name: "Description", description: "Company description" },
  { id: "3", name: "URL", description: "Company URL" },
  { id: "4", name: "Industry", description: "Industry or sector" },
  { id: "5", name: "Location", description: "Company location" },
  { id: "6", name: "Team", description: "Team size and key members" },
  { id: "7", name: "Traction", description: "Summary of company traction, including revenue, users, and growth" },
  { id: "8", name: "Ask", description: "Amount of funding requested and valuation" }
];

interface SchemaDefinitionProps {
  onSchemaChange: (schema: SchemaField[]) => void;
}

export function SchemaDefinition({ onSchemaChange }: SchemaDefinitionProps) {
  const [fields, setFields] = useState<SchemaField[]>(defaultSchema);

  const addField = () => {
    const newField = {
      id: Date.now().toString(),
      name: "",
      description: ""
    };
    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    onSchemaChange(updatedFields);
  };

  const removeField = (id: string) => {
    const updatedFields = fields.filter(field => field.id !== id);
    setFields(updatedFields);
    onSchemaChange(updatedFields);
  };

  const updateField = (id: string, key: keyof SchemaField, value: string) => {
    const updatedFields = fields.map(field => {
      if (field.id === id) {
        return { ...field, [key]: value };
      }
      return field;
    });
    setFields(updatedFields);
    onSchemaChange(updatedFields);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.id} className="flex gap-2">
            <Input
              placeholder="Field name"
              value={field.name}
              onChange={(e) => updateField(field.id, "name", e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Description"
              value={field.description}
              onChange={(e) => updateField(field.id, "description", e.target.value)}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeField(field.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        onClick={addField}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Field
      </Button>
    </div>
  );
}
