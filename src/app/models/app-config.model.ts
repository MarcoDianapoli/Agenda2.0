export interface AppConfig {
  appName: string;
  headerColor: string;
  fontFamily: string;
  backgroundColor: string;
  backgroundImage: string | null;
}

export const DEFAULT_CONFIG: AppConfig = {
  appName: 'Agenda Personal',
  headerColor: '#4CAF50',
  fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, sans-serif',
  backgroundColor: '#f5f5f5',
  backgroundImage: null
};

export const FONT_OPTIONS = [
  { value: "'Roboto', sans-serif", label: 'Roboto (Predeterminada)' },
  { value: "'Open Sans', sans-serif", label: 'Open Sans' },
  { value: "'Lato', sans-serif", label: 'Lato' },
  { value: "'Montserrat', sans-serif", label: 'Montserrat' },
  { value: "'Poppins', sans-serif", label: 'Poppins' },
  { value: "'Arial', sans-serif", label: 'Arial' }
];
