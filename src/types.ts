/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ToolCategory = 'dev' | 'design' | 'utility' | 'math' | 'date' | 'api' | 'settings' | 'games';

export interface Tool {
  id: string;
  name: string;
  description: string;
  name_fa?: string;
  description_fa?: string;
  category: ToolCategory;
  icon: string; // Lucide icon name
  commands: string[]; // Keywords for Command Center search
}

export interface AppSettings {
  theme: 'light' | 'dark';
  accentColor: 'indigo' | 'emerald' | 'blue' | 'violet' | 'rose' | 'amber' | 'zinc';
  fontSize: 'sm' | 'base' | 'lg';
  language: 'en' | 'fa';
  animationsEnabled: boolean;
}

export interface QuickNote {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface APIState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  cachedAt?: number;
}
