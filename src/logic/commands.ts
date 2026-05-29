// src/logic/commands.ts
import type { ProjectConfig } from '../types';

export function isJSProject(config: ProjectConfig): boolean {
  return config.frontend !== 'none' || config.backend === 'nodejs';
}

export function getInstallCmd(config: ProjectConfig): string {
  if (!isJSProject(config)) {
    if (config.backend === 'go') return 'go mod download';
    if (config.backend === 'python') return 'pip install -r requirements.txt';
    if (config.backend === 'rust') return 'cargo build';
    if (config.backend === 'dotnet') return 'dotnet restore';
  }
  const pm = config.packageManager;
  return pm === 'npm' ? 'npm install' : `${pm} install`;
}

export function getDevCmd(config: ProjectConfig): string {
  if (!isJSProject(config)) {
    if (config.backend === 'go') return 'go run ./cmd/server';
    if (config.backend === 'python') return 'uvicorn main:app --reload';
    if (config.backend === 'rust') return 'cargo run';
    if (config.backend === 'dotnet') return 'dotnet watch run';
  }
  const pm = config.packageManager;
  const cmds: Record<string, string> = {
    npm: 'npm run dev', pnpm: 'pnpm dev', bun: 'bun dev', yarn: 'yarn dev',
  };
  return cmds[pm] ?? 'npm run dev';
}

export function getBuildCmd(config: ProjectConfig): string {
  if (!isJSProject(config)) {
    if (config.backend === 'go') return 'go build ./...';
    if (config.backend === 'python') return 'python -m build';
    if (config.backend === 'rust') return 'cargo build --release';
    if (config.backend === 'dotnet') return 'dotnet build -c Release';
  }
  const pm = config.packageManager;
  return `${pm === 'npm' ? 'npm run' : pm} build`;
}

export function getStartCmd(config: ProjectConfig): string {
  if (!isJSProject(config)) {
    if (config.backend === 'go') return 'go run ./cmd/server';
    if (config.backend === 'python') return 'uvicorn main:app';
    if (config.backend === 'rust') return 'cargo run --release';
    if (config.backend === 'dotnet') return 'dotnet run -c Release';
  }
  const pm = config.packageManager;
  return `${pm === 'npm' ? 'npm run' : pm} start`;
}

export function getTestCmd(config: ProjectConfig): string {
  if (!isJSProject(config)) {
    if (config.backend === 'go') return 'go test ./...';
    if (config.backend === 'python') return 'pytest';
    if (config.backend === 'rust') return 'cargo test';
    if (config.backend === 'dotnet') return 'dotnet test';
  }
  const pm = config.packageManager;
  return pm === 'npm' ? 'npm test' : `${pm} test`;
}

export function getLintCmd(config: ProjectConfig): string {
  if (!isJSProject(config)) {
    if (config.backend === 'go') return 'golangci-lint run';
    if (config.backend === 'python') return 'ruff check .';
    if (config.backend === 'rust') return 'cargo clippy';
    if (config.backend === 'dotnet') return 'dotnet format';
  }
  const pm = config.packageManager;
  return pm === 'npm' ? 'npm run lint' : `${pm} lint`;
}

export function getDepsLabel(config: ProjectConfig): string {
  if (!isJSProject(config)) {
    if (config.backend === 'go') return 'go mod';
    if (config.backend === 'python') return 'pip / poetry';
    if (config.backend === 'rust') return 'cargo';
    if (config.backend === 'dotnet') return 'NuGet';
    return 'N/A';
  }
  return config.packageManager;
}

export function getTestFilePattern(config: ProjectConfig): string {
  if (!isJSProject(config)) {
    if (config.backend === 'go') return '`*_test.go` (same package)';
    if (config.backend === 'python') return '`test_*.py` files under `tests/`';
    if (config.backend === 'rust') return '`#[cfg(test)]` modules inline';
    if (config.backend === 'dotnet') return 'Separate `*.Tests` project';
  }
  return 'co-located `*.test.ts`';
}
