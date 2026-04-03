export type HiveStatus = 'healthy' | 'warning' | 'critical';
export type LogEventType = 'inspection' | 'feeding' | 'treatment' | 'harvest' | 'observation';

export interface Apiary {
  id: number;
  name: string;
  location: string;
  hiveCount: number;
}

export interface Hive {
  id: number;
  apiaryId: number;
  name: string;
  status: HiveStatus;
  queenColor: string;
  queenYear: number;
  lastCheck: string; // ISO date string e.g. "2026-06-12"
}

export interface HiveLog {
  id: number;
  hiveId: number;
  hiveName: string;
  apiaryName: string;
  type: LogEventType;
  date: string; // ISO date string
  notes?: string;
}
