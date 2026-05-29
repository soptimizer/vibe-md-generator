import { describe, it, expect } from 'vitest';
import { getBuildCmd, getInstallCmd, getDevCmd, getTestCmd } from './commands';
import type { ProjectConfig } from '../types';

const base: ProjectConfig = {
  name: 'test',
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

describe('getBuildCmd', () => {
  it('never returns null or undefined', () => {
    const backends = ['nodejs', 'python', 'go', 'rust', 'dotnet', 'none'] as const;
    for (const backend of backends) {
      const result = getBuildCmd({ ...base, frontend: backend === 'none' ? 'react' : 'none', backend });
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
      expect(typeof result).toBe('string');
    }
  });

  it('returns python -m build for python backend', () => {
    const result = getBuildCmd({ ...base, frontend: 'none', backend: 'python' });
    expect(result).toBe('python -m build');
  });

  it('returns go build command for go backend', () => {
    const result = getBuildCmd({ ...base, frontend: 'none', backend: 'go' });
    expect(result).toBe('go build ./...');
  });

  it('returns cargo build for rust backend', () => {
    const result = getBuildCmd({ ...base, frontend: 'none', backend: 'rust' });
    expect(result).toBe('cargo build --release');
  });

  it('returns npm run build for JS project', () => {
    const result = getBuildCmd({ ...base, frontend: 'react', backend: 'none', packageManager: 'npm' });
    expect(result).toBe('npm run build');
  });

  it('returns pnpm build for pnpm project', () => {
    const result = getBuildCmd({ ...base, frontend: 'react', backend: 'none', packageManager: 'pnpm' });
    expect(result).toBe('pnpm build');
  });
});

describe('getInstallCmd', () => {
  it('returns pip install for python', () => {
    expect(getInstallCmd({ ...base, frontend: 'none', backend: 'python' })).toBe('pip install -r requirements.txt');
  });

  it('returns go mod download for go', () => {
    expect(getInstallCmd({ ...base, frontend: 'none', backend: 'go' })).toBe('go mod download');
  });

  it('returns yarn install for yarn', () => {
    expect(getInstallCmd({ ...base, packageManager: 'yarn' })).toBe('yarn install');
  });

  it('returns bun install for bun', () => {
    expect(getInstallCmd({ ...base, packageManager: 'bun' })).toBe('bun install');
  });
});

describe('getTestCmd', () => {
  it('returns pytest for python', () => {
    expect(getTestCmd({ ...base, frontend: 'none', backend: 'python' })).toBe('pytest');
  });

  it('returns go test for go', () => {
    expect(getTestCmd({ ...base, frontend: 'none', backend: 'go' })).toBe('go test ./...');
  });

  it('returns npm test for npm JS project', () => {
    expect(getTestCmd({ ...base, packageManager: 'npm' })).toBe('npm test');
  });
});

describe('getDevCmd', () => {
  it('returns uvicorn for python', () => {
    expect(getDevCmd({ ...base, frontend: 'none', backend: 'python' })).toBe('uvicorn main:app --reload');
  });

  it('returns cargo run for rust', () => {
    expect(getDevCmd({ ...base, frontend: 'none', backend: 'rust' })).toBe('cargo run');
  });
});
