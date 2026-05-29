// src/logic/skillsHelper.ts
import type { ProjectConfig } from '../types';

export const hasSkill = (config: ProjectConfig, id: string): boolean =>
  config.selectedSkills.includes(id);

export const hasAnySkill = (config: ProjectConfig, ids: string[]): boolean =>
  ids.some((id) => config.selectedSkills.includes(id));
