import type { ProjectConfig } from '../../types';

export default function OPENCODE_JSON_tmpl(_config: ProjectConfig): string {
  return JSON.stringify(
    {
      $schema: 'https://opencode.ai/config.json',
      skills: {
        paths: ['.agent/skills'],
      },
    },
    null,
    2,
  );
}
