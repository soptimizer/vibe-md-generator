// src/store/projectStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

export const useProjectStore = create<WizardStore>()(
  persist(
    (set, get) => ({
      step: 1,
      theme: 'dark',
      config: defaultConfig,
      generatedFiles: [],

      setStep: (step) => set({ step }),

      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: next });
        if (next === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      updateConfig: (partial) => {
        set((state) => ({ config: { ...state.config, ...partial } }));
        const updatedConfig = get().config;
        if (updatedConfig.name.trim()) {
          const files = generateFiles(updatedConfig);
          set({ generatedFiles: files });
        }
      },

      generateFiles: () => {
        const config = get().config;
        if (!config.name.trim()) return;
        const files = generateFiles(config);
        set({ generatedFiles: files });
      },

      reset: () => {
        set({ step: 1, config: defaultConfig, generatedFiles: [] });
      },
    }),
    {
      name: 'vibemd-wizard',
      partialize: (state) => ({ step: state.step, theme: state.theme, config: state.config }),
      onRehydrateStorage: () => (state) => {
        // Sync the theme class on hydration
        if (state) {
          if (state.theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
    },
  ),
);
