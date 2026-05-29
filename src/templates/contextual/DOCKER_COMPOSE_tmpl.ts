// src/templates/contextual/DOCKER_COMPOSE_tmpl.ts
import type { ProjectConfig } from '../../types';

function getAppService(config: ProjectConfig): string {
  const portMap: Record<string, string> = {
    nodejs: '3000:3000',
    python: '8000:8000',
    go: '8080:8080',
    rust: '8080:8080',
    dotnet: '5000:5000',
  };
  const port = config.backend !== 'none' ? portMap[config.backend] ?? '3000:3000' : '3000:3000';

  const frontendPort = config.frontend !== 'none' && config.backend === 'none' ? '5173:5173' : null;
  const exposedPort = frontendPort ?? port;

  return `  app:
    build: .
    ports:
      - "${exposedPort}"
    environment:
      - NODE_ENV=development
    env_file:
      - .env
    depends_on:${config.databases.length > 0 || config.queues.length > 0 ? '' : ' []'}
${config.databases.includes('postgresql') ? '      - postgres\n' : ''}\
${config.databases.includes('mysql') ? '      - mysql\n' : ''}\
${config.databases.includes('mongodb') ? '      - mongo\n' : ''}\
${config.databases.includes('redis') ? '      - redis\n' : ''}\
${config.queues.includes('kafka') ? '      - kafka\n' : ''}\
${config.queues.includes('rabbitmq') ? '      - rabbitmq\n' : ''}\
    volumes:
      - .:/app
      - /app/node_modules
    restart: unless-stopped`;
}

function getDatabaseServices(config: ProjectConfig): string {
  const services: string[] = [];

  if (config.databases.includes('postgresql')) {
    services.push(`  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: \${POSTGRES_DB:-${config.name.toLowerCase().replace(/\s+/g, '_')}}
      POSTGRES_USER: \${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:-postgres}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped`);
  }

  if (config.databases.includes('mysql')) {
    services.push(`  mysql:
    image: mysql:8-debian
    environment:
      MYSQL_DATABASE: \${MYSQL_DATABASE:-${config.name.toLowerCase().replace(/\s+/g, '_')}}
      MYSQL_ROOT_PASSWORD: \${MYSQL_ROOT_PASSWORD:-root}
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped`);
  }

  if (config.databases.includes('mongodb')) {
    services.push(`  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped`);
  }

  if (config.databases.includes('redis')) {
    services.push(`  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped`);
  }

  if (config.queues.includes('rabbitmq')) {
    services.push(`  rabbitmq:
    image: rabbitmq:3-management-alpine
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: \${RABBITMQ_USER:-guest}
      RABBITMQ_DEFAULT_PASS: \${RABBITMQ_PASS:-guest}
    restart: unless-stopped`);
  }

  if (config.queues.includes('kafka')) {
    services.push(`  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
    restart: unless-stopped

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    restart: unless-stopped`);
  }

  return services.join('\n\n');
}

function getVolumes(config: ProjectConfig): string {
  const vols: string[] = [];
  if (config.databases.includes('postgresql')) vols.push('  postgres_data:');
  if (config.databases.includes('mysql')) vols.push('  mysql_data:');
  if (config.databases.includes('mongodb')) vols.push('  mongo_data:');
  if (config.databases.includes('redis')) vols.push('  redis_data:');
  if (vols.length === 0) return '';
  return `\nvolumes:\n${vols.join('\n')}`;
}

export default function DOCKER_COMPOSE_tmpl(config: ProjectConfig): string {
  const dbServices = getDatabaseServices(config);
  return `# docker-compose.yml — ${config.name}
# Usage: docker compose up -d

services:
${getAppService(config)}
${dbServices ? `\n${dbServices}` : ''}
${getVolumes(config)}`;
}
