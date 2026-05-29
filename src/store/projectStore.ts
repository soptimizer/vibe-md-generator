// src/store/projectStore.ts
import { create } from 'zustand';
import type { WizardStore, ProjectConfig } from '../types';
import { generateFiles } from '../logic/generator';

const defaultConfig: ProjectConfig = {
  name: '',
  description: '',
  type: 'webapp',
  scale: 'solo',
  aiTool: 'claude',
  frontend: 'react',
  backend: 'none',
  databases: [],
  queues: [],
  packageManager: 'npm',
  hasAuth: false,
  hasPayments: false,
  hasTesting: false,
  hasDeployment: false,
  tokenEfficiency: 'balanced',
  aiRole: 'assistant',
  selectedSkills: [],
};

export const useProjectStore = create<WizardStore>((set, get) => ({
  step: 1,
  config: defaultConfig,
  generatedFiles: [],

  setStep: (step) => set({ step }),

  updateConfig: (partial) =>
    set((state) => ({ config: { ...state.config, ...partial } })),

  generateFiles: () => {
    const files = generateFiles(get().config);
    set({ generatedFiles: files });
  },

  reset: () => set({ step: 1, config: defaultConfig, generatedFiles: [] }),
}));
