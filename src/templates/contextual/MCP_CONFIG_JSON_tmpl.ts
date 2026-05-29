// src/templates/contextual/MCP_CONFIG_JSON_tmpl.ts
import type { ProjectConfig } from '../../types';

interface MCPServer {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

export default function MCP_CONFIG_JSON_tmpl(config: ProjectConfig): string {
  const servers: Record<string, MCPServer> = {};

  // Filesystem server — always useful
  servers['filesystem'] = {
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', '.'],
  };

  // Database-specific MCP servers
  if (config.databases.includes('postgresql') || config.databases.includes('mysql')) {
    const dbKey = config.databases.includes('postgresql') ? 'postgres' : 'mysql';
    servers[dbKey] = {
      command: 'npx',
      args: ['-y', `@modelcontextprotocol/server-${dbKey}`],
      env: {
        DATABASE_URL: `$\{${dbKey.toUpperCase()}_URL}`,
      },
    };
  }

  if (config.databases.includes('sqlite')) {
    servers['sqlite'] = {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-sqlite', './db/database.sqlite'],
    };
  }

  // Fetch server for projects with APIs or external integrations
  if (config.backend !== 'none' || config.type === 'api' || config.type === 'service') {
    servers['fetch'] = {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-fetch'],
    };
  }

  // Git server for team projects
  if (config.scale !== 'solo') {
    servers['git'] = {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-git', '--repository', '.'],
    };
  }

  return JSON.stringify({ mcpServers: servers }, null, 2);
}
