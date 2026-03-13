import { supabase } from './supabaseClient';

export interface ProrabRow {
  date: string;
  section: string;
  floor: string;
  workType: string;
  description: string;
  progress: number;
  executor: string;
  workerCount: number;
  issues: string;
  notes: string;
}

export interface SupplyRow {
  date: string;
  time: string;
  plateNumber: string;
  material: string;
  quantity: number;
  unit: string;
  supplier: string;
  notes: string;
  status?: string;
}

export interface SheetsData {
  prorab: ProrabRow[];
  supply: SupplyRow[];
  fetchedAt: Date;
}

async function fetchProrab(): Promise<ProrabRow[]> {
  const { data, error } = await supabase
    .from('work_logs')
    .select('*')
    .order('log_date', { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);

  return (data ?? []).map((r) => ({
    date: r.log_date,
    section: r.section ?? '',
    floor: r.section ?? '',
    workType: r.work_description ?? '',
    description: r.work_description ?? '',
    progress: r.quantity ?? 0,
    executor: '',
    workerCount: 0,
    issues: '',
    notes: r.notes ?? '',
  }));
}

async function fetchSupply(): Promise<SupplyRow[]> {
  const { data, error } = await supabase
    .from('deliveries')
    .select('*')
    .order('delivery_date', { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);

  return (data ?? []).map((r) => ({
    date: r.delivery_date ?? '',
    time: r.delivery_time ?? '',
    plateNumber: r.plate_number ?? '',
    material: r.material ?? '',
    quantity: r.quantity ?? 0,
    unit: r.unit ?? '',
    supplier: r.supplier ?? '',
    notes: r.notes ?? '',
    status: r.status ?? 'delivered',
  }));
}

export async function fetchSheetsData(): Promise<SheetsData> {
  const [prorab, supply] = await Promise.all([fetchProrab(), fetchSupply()]);
  return { prorab, supply, fetchedAt: new Date() };
}
