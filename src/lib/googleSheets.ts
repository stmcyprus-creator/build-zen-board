// Google Sheets CSV fetcher & parser for the construction BI dashboard

const SPREADSHEET_ID = "1mBY01uAqRTnyQs7A3bFsgUGcpLpYlukSvp4bnsx4Euw";

// Sheet GIDs
const SHEETS = {
  prоrab: 938512291, // Прораб
  supply: 0,         // Снабжение (поставки)
} as const;

function csvUrl(gid: number): string {
  return `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}`;
}

/** Parse a CSV string into an array of rows (array of strings). Handles quoted fields. */
function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i];
    if (inQuotes) {
      if (ch === '"' && csv[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        row.push(current.trim());
        current = "";
      } else if (ch === "\n" || (ch === "\r" && csv[i + 1] === "\n")) {
        row.push(current.trim());
        if (row.some((c) => c !== "")) rows.push(row);
        row = [];
        current = "";
        if (ch === "\r") i++;
      } else {
        current += ch;
      }
    }
  }
  // last field
  row.push(current.trim());
  if (row.some((c) => c !== "")) rows.push(row);
  return rows;
}

// ---------- Data types ----------

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
}

export interface SheetsData {
  prorab: ProrabRow[];
  supply: SupplyRow[];
  fetchedAt: Date;
}

function parseProrab(rows: string[][]): ProrabRow[] {
  // Skip header row (first row)
  return rows.slice(1).map((r) => ({
    date: r[0] ?? "",
    section: r[1] ?? "",
    floor: r[2] ?? "",
    workType: r[3] ?? "",
    description: r[4] ?? "",
    progress: parseFloat(r[5]) || 0,
    executor: r[6] ?? "",
    workerCount: parseInt(r[7]) || 0,
    issues: r[8] ?? "",
    notes: r[9] ?? "",
  }));
}

function parseSupply(rows: string[][]): SupplyRow[] {
  return rows.slice(1).map((r) => ({
    date: r[0] ?? "",
    time: r[1] ?? "",
    plateNumber: r[2] ?? "",
    material: r[3] ?? "",
    quantity: parseFloat(r[4]) || 0,
    unit: r[5] ?? "",
    supplier: r[6] ?? "",
    notes: r[7] ?? "",
  }));
}

export async function fetchSheetsData(): Promise<SheetsData> {
  const [prorabCsv, supplyCsv] = await Promise.all([
    fetch(csvUrl(SHEETS.prоrab)).then((r) => r.text()),
    fetch(csvUrl(SHEETS.supply)).then((r) => r.text()),
  ]);

  const prorabRows = parseCsv(prorabCsv);
  const supplyRows = parseCsv(supplyCsv);

  return {
    prorab: parseProrab(prorabRows),
    supply: parseSupply(supplyRows),
    fetchedAt: new Date(),
  };
}
