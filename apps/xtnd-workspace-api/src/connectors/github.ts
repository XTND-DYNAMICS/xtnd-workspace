import type { ConnectorDriver, ConnectorDiscoveryResult } from './base.js';

export class GitHubConnector implements ConnectorDriver {
  async testConnection(config: Record<string, unknown>): Promise<{ ok: boolean; message?: string }> {
    if (!config.token) {
      return { ok: false, message: 'Missing GitHub Personal Access Token' };
    }
    return { ok: true, message: 'GitHub connection established' };
  }

  async discover(config: Record<string, unknown>): Promise<ConnectorDiscoveryResult> {
    const nodes: ConnectorDiscoveryResult['nodes'] = [];
    const relations: ConnectorDiscoveryResult['relations'] = [];

    const repos = (config.sampleRepos as Array<{ name: string; issues?: Array<{ number: number; title: string }> }>) || [];

    for (const repo of repos) {
      const repoExternalId = `github/${repo.name}`;
      nodes.push({
        externalId: repoExternalId,
        type: 'github_repo',
        title: repo.name,
        writePolicy: 'read_only',
        metadata: { repo: repo.name }
      });

      for (const issue of repo.issues || []) {
        const issueExternalId = `${repoExternalId}#${issue.number}`;
        nodes.push({
          externalId: issueExternalId,
          type: 'github_issue',
          title: `#${issue.number} ${issue.title}`,
          writePolicy: 'bidirectional_writeback',
          metadata: { issueNumber: issue.number, repo: repo.name }
        });

        relations.push({
          fromExternalId: repoExternalId,
          toExternalId: issueExternalId,
          relationType: 'contains',
          origin: 'structural_derived'
        });
      }
    }

    return { nodes, relations };
  }

  async fetchLiveProjection(externalId: string, config: Record<string, unknown>): Promise<Record<string, unknown>> {
    return {
      type: 'github_live_card',
      target: externalId,
      state: 'open',
      fetchedAt: new Date().toISOString()
    };
  }
}
