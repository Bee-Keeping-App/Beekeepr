import { Apiary, Hive, HiveLog, HiveStatus, LogEventType } from '../@types/apiary';

// ---------------------------------------------------------------------------
// Mock data — replace function bodies with real fetch() calls when the
// backend endpoints are ready.
// ---------------------------------------------------------------------------

let nextApiaryId = 3;
let nextHiveId = 6;
let nextLogId = 10;

const mockApiaries: Apiary[] = [
  { id: 1, name: 'North Apiary', location: 'Backyard – North Corner', hiveCount: 3 },
  { id: 2, name: 'Garden Apiary', location: 'Front Garden – East Side', hiveCount: 2 },
];

const mockHives: Hive[] = [
  { id: 1, apiaryId: 1, name: 'Hive #1', status: 'healthy', queenColor: 'Blue', queenYear: 2024, lastCheck: '2026-06-12' },
  { id: 2, apiaryId: 1, name: 'Hive #2', status: 'warning', queenColor: 'Yellow', queenYear: 2023, lastCheck: '2026-06-10' },
  { id: 3, apiaryId: 1, name: 'Hive #3', status: 'critical', queenColor: 'Red', queenYear: 2022, lastCheck: '2026-05-28' },
  { id: 4, apiaryId: 2, name: 'Hive #1', status: 'healthy', queenColor: 'Green', queenYear: 2025, lastCheck: '2026-06-15' },
  { id: 5, apiaryId: 2, name: 'Hive #2', status: 'healthy', queenColor: 'Blue', queenYear: 2024, lastCheck: '2026-06-14' },
];

const mockLogs: HiveLog[] = [
  { id: 1, hiveId: 1, hiveName: 'Hive #1', apiaryName: 'North Apiary', type: 'inspection', date: '2026-06-20', notes: 'Queen present, brood healthy' },
  { id: 2, hiveId: 1, hiveName: 'Hive #1', apiaryName: 'North Apiary', type: 'feeding', date: '2026-06-10', notes: 'Sugar syrup added' },
  { id: 3, hiveId: 2, hiveName: 'Hive #2', apiaryName: 'North Apiary', type: 'treatment', date: '2026-06-05', notes: 'Oxalic acid treatment' },
  { id: 4, hiveId: 1, hiveName: 'Hive #1', apiaryName: 'North Apiary', type: 'inspection', date: '2026-05-30', notes: 'Queen spotted' },
  { id: 5, hiveId: 4, hiveName: 'Hive #1', apiaryName: 'Garden Apiary', type: 'inspection', date: '2026-06-15', notes: 'All good, honey super filling up' },
];

// ---------------------------------------------------------------------------
// GET /apiaries
// ---------------------------------------------------------------------------
export async function getApiaries(): Promise<Apiary[]> {
  return [...mockApiaries];
}

// ---------------------------------------------------------------------------
// GET /apiaries/:id/hives
// ---------------------------------------------------------------------------
export async function getHivesForApiary(apiaryId: number): Promise<Hive[]> {
  return mockHives.filter(h => h.apiaryId === apiaryId);
}

// ---------------------------------------------------------------------------
// GET /hives/:id/logs
// ---------------------------------------------------------------------------
export async function getHiveLogs(hiveId: number): Promise<HiveLog[]> {
  return mockLogs
    .filter(l => l.hiveId === hiveId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

// ---------------------------------------------------------------------------
// GET /logs  (all logs across all apiaries, newest first)
// ---------------------------------------------------------------------------
export async function getAllLogs(): Promise<HiveLog[]> {
  return [...mockLogs].sort((a, b) => b.date.localeCompare(a.date));
}

// ---------------------------------------------------------------------------
// POST /hives/:id/log
// ---------------------------------------------------------------------------
export async function logHiveEvent(
  hiveId: number,
  type: LogEventType,
  notes: string,
): Promise<void> {
  const hive = mockHives.find(h => h.id === hiveId);
  if (!hive) return;
  const apiary = mockApiaries.find(a => a.id === hive.apiaryId);
  const today = new Date().toISOString().split('T')[0];
  mockLogs.unshift({
    id: nextLogId++,
    hiveId,
    hiveName: hive.name,
    apiaryName: apiary?.name ?? 'Unknown',
    type,
    date: today,
    notes: notes.trim() || undefined,
  });
  hive.lastCheck = today;
}

// ---------------------------------------------------------------------------
// POST /apiaries/:id/hives
// ---------------------------------------------------------------------------
export async function addHive(
  apiaryId: number,
  name: string,
  queenColor: string,
  queenYear: number,
  status: HiveStatus,
): Promise<Hive> {
  const hive: Hive = {
    id: nextHiveId++,
    apiaryId,
    name,
    queenColor,
    queenYear,
    status,
    lastCheck: new Date().toISOString().split('T')[0],
  };
  mockHives.push(hive);
  const apiary = mockApiaries.find(a => a.id === apiaryId);
  if (apiary) apiary.hiveCount++;
  return hive;
}

// ---------------------------------------------------------------------------
// POST /apiaries
// ---------------------------------------------------------------------------
export async function createApiary(
  name: string,
  location: string,
  coordinates?: string,
  notes?: string,
): Promise<Apiary> {
  const apiary: Apiary = { id: nextApiaryId++, name, location, hiveCount: 0 };
  mockApiaries.push(apiary);
  // coordinates and notes will be stored once the real backend is wired up
  void coordinates;
  void notes;
  return apiary;
}
