export enum AnalysisType {
  CODE_SNIPPET = 'CODE_SNIPPET',
  HTTP_HEADERS = 'HTTP_HEADERS',
  API_DEFINITION = 'API_DEFINITION',
  CONFIG_FILE = 'CONFIG_FILE',
  URL_SCAN = 'URL_SCAN'
}

export interface SecurityFinding {
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  description: string;
  remediation: string;
  affectedComponent?: string;
}

export interface SeoFinding {
  title: string;
  importance: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  recommendation: string;
}

export interface AnalysisResult {
  id?: string;        // UUID for history tracking
  timestamp?: string; // ISO date for history
  targetUrl?: string; // The URL that was scanned
  score: number; // Security score 0 to 100
  seoScore?: number; // SEO score 0 to 100
  riskLevel: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  summary: string;
  findings: SecurityFinding[];
  seoFindings?: SeoFinding[];
  exposedEndpoints: string[]; // List of potentially exposed endpoints detected
}

export interface ScanOptions {
  checkSecurity: boolean;
  checkSeo: boolean;
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
}