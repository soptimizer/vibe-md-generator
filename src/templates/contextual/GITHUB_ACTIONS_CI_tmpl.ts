// src/templates/contextual/GITHUB_ACTIONS_CI_tmpl.ts
import type { ProjectConfig } from '../../types';
import { getTestCmd, getLintCmd, getBuildCmd } from '../../logic/commands';

function getNodeVersion(config: ProjectConfig): string {
  if (config.backend === 'nodejs' || config.frontend !== 'none') return '20';
  return '20';
}

function getPythonSteps(config: ProjectConfig): string {
  const testCmd = config.hasTesting ? getTestCmd(config) : null;
  const lintCmd = getLintCmd(config);
  return `    - name: Set up Python
      uses: actions/setup-python@v5
      with:
        python-version: '3.12'
        cache: 'pip'

    - name: Install dependencies
      run: pip install -r requirements.txt

    - name: Lint
      run: ${lintCmd}
${testCmd ? `\n    - name: Test\n      run: ${testCmd}` : ''}`;
}

function getGoSteps(config: ProjectConfig): string {
  const testCmd = config.hasTesting ? getTestCmd(config) : null;
  return `    - name: Set up Go
      uses: actions/setup-go@v5
      with:
        go-version: '1.22'

    - name: Download dependencies
      run: go mod download

    - name: Build
      run: go build ./...
${testCmd ? `\n    - name: Test\n      run: ${testCmd}` : ''}`;
}

function getRustSteps(config: ProjectConfig): string {
  const testCmd = config.hasTesting ? getTestCmd(config) : null;
  return `    - name: Set up Rust
      uses: dtolnay/rust-toolchain@stable

    - name: Cache cargo
      uses: Swatinem/rust-cache@v2

    - name: Build
      run: cargo build --release

    - name: Lint
      run: cargo clippy -- -D warnings
${testCmd ? `\n    - name: Test\n      run: ${testCmd}` : ''}`;
}

function getNodeSteps(config: ProjectConfig): string {
  const pm = config.packageManager;
  const installCmd = pm === 'npm' ? 'npm ci' : pm === 'yarn' ? 'yarn --frozen-lockfile' : `${pm} install --frozen-lockfile`;
  const lintCmd = getLintCmd(config);
  const buildCmd = getBuildCmd(config);
  const testCmd = config.hasTesting ? getTestCmd(config) : null;

  const cacheKey = pm === 'npm' ? "'npm'" : pm === 'yarn' ? "'yarn'" : `'${pm}'`;

  return `    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '${getNodeVersion(config)}'
        cache: ${cacheKey}

    - name: Install dependencies
      run: ${installCmd}

    - name: Lint
      run: ${lintCmd}
${buildCmd ? `\n    - name: Build\n      run: ${buildCmd}` : ''}
${testCmd ? `\n    - name: Test\n      run: ${testCmd}` : ''}`;
}

function getSetupSteps(config: ProjectConfig): string {
  if (config.backend === 'python') return getPythonSteps(config);
  if (config.backend === 'go') return getGoSteps(config);
  if (config.backend === 'rust') return getRustSteps(config);
  return getNodeSteps(config);
}

function getServicesBlock(config: ProjectConfig): string {
  const services: string[] = [];

  if (config.databases.includes('postgresql')) {
    services.push(`      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432`);
  }
  if (config.databases.includes('redis')) {
    services.push(`      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379`);
  }
  if (config.databases.includes('mysql')) {
    services.push(`      mysql:
        image: mysql:8
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: test
        options: >-
          --health-cmd "mysqladmin ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 3306:3306`);
  }

  if (services.length === 0) return '';
  return `    services:\n${services.join('\n\n')}`;
}

export default function GITHUB_ACTIONS_CI_tmpl(config: ProjectConfig): string {
  const servicesBlock = getServicesBlock(config);
  return `# .github/workflows/ci.yml — ${config.name}

name: CI

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  ci:
    runs-on: ubuntu-latest
${servicesBlock ? `${servicesBlock}\n` : ''}
    steps:
    - name: Checkout
      uses: actions/checkout@v4

${getSetupSteps(config)}
`;
}
