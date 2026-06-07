import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface LogField {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
}

export const DEFAULT_LOG_FIELDS: LogField[] = [
  { key: 'queenSeen',        label: 'Queen Seen',      description: 'Did you spot the queen?',              enabled: true  },
  { key: 'queenCells',       label: 'Queen Cells',     description: 'Were queen cells present?',            enabled: true  },
  { key: 'broodPattern',     label: 'Brood Pattern',   description: 'Quality of the brood pattern',         enabled: true  },
  { key: 'framesOfBees',     label: 'Frames of Bees',  description: 'Frames covered with bees',             enabled: true  },
  { key: 'framesOfBrood',    label: 'Frames of Brood', description: 'Frames of brood present',              enabled: true  },
  { key: 'honeyStores',      label: 'Honey Stores',    description: 'Frames of capped honey',               enabled: true  },
  { key: 'pollenStores',     label: 'Pollen Stores',   description: 'Frames of pollen',                     enabled: false },
  { key: 'hiveWeight',       label: 'Hive Weight',     description: 'Total hive weight (lbs)',              enabled: true  },
  { key: 'miteCount',        label: 'Mite Count',      description: 'Varroa mites per 100 bees',            enabled: true  },
  { key: 'temperament',      label: 'Temperament',     description: 'Colony temperament during inspection', enabled: true  },
  { key: 'treatmentApplied', label: 'Treatment',       description: 'Was any treatment applied?',           enabled: true  },
  { key: 'feeding',          label: 'Feeding',         description: 'Was the colony fed?',                  enabled: true  },
  { key: 'overallStatus',    label: 'Overall Status',  description: 'General health assessment',            enabled: true  },
];

interface LogSettingsContextType {
  fields: LogField[];
  toggleField: (key: string) => void;
  isEnabled: (key: string) => boolean;
}

const LogSettingsContext = createContext<LogSettingsContextType | undefined>(undefined);

export function LogSettingsProvider({ children }: { children: ReactNode }) {
  const [fields, setFields] = useState<LogField[]>(DEFAULT_LOG_FIELDS);

  function toggleField(key: string) {
    setFields(prev => prev.map(f => f.key === key ? { ...f, enabled: !f.enabled } : f));
  }

  function isEnabled(key: string) {
    return fields.find(f => f.key === key)?.enabled ?? true;
  }

  return (
    <LogSettingsContext.Provider value={{ fields, toggleField, isEnabled }}>
      {children}
    </LogSettingsContext.Provider>
  );
}

export function useLogSettings() {
  const ctx = useContext(LogSettingsContext);
  if (!ctx) throw new Error('useLogSettings must be used inside LogSettingsProvider');
  return ctx;
}