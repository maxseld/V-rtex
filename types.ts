export type AspectRatio = '16:9' | '9:16';

export interface VSLConfig {
  id: string;
  name: string;
  videoUrl: string;
  ratio: AspectRatio;
  primaryColor: string;
  retentionSpeed: number; // 0.1 to 1.0
  hasDelay: boolean;
  delaySeconds: number;
  views: number;
  lastEdited: string;
}

export interface User {
  email: string;
  name: string;
}

// Default initial state for a new VSL
export const DEFAULT_VSL: VSLConfig = {
  id: '',
  name: 'Nova VSL Sem Título',
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  ratio: '16:9',
  primaryColor: '#2563eb',
  retentionSpeed: 0.5,
  hasDelay: false,
  delaySeconds: 60,
  views: 0,
  lastEdited: new Date().toISOString(),
};