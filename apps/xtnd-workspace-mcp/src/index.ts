#!/usr/bin/env node
import { createInterface } from 'node:readline';

interface JsonRpcRequest {
  jsonrpc: '2.0';
  id?: number | string;
  method: string;
  params?: any;
}

interface JsonRpcResponse {
  jsonrpc: '2.0';
  id?: number | string;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

const TOOLS = [
  {
    name: 'xworkspace_search_nodes',
    description: 'Search across native documents and federated sources (Dropbox, Notion, GitHub, SQL) in XWORKSPACE.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search term or keyword' },
        limit: { type: 'number', description: 'Maximum results to return' }
      },
      required: ['query']
    }
  },
  {
    name: 'xworkspace_get_node',
    description: 'Retrieve a node from the XWORKSPACE entity graph by its unique GUID, along with relations and provenance.',
    inputSchema: {
      type: 'object',
      properties: {
        nodeGuid: { type: 'string', description: 'GUID of the node' }
      },
      required: ['nodeGuid']
    }
  },
  {
    name: 'xworkspace_query_graph',
    description: 'Traverse the entity graph starting from a node to discover linked dependencies, citations, and source documents.',
    inputSchema: {
      type: 'object',
      properties: {
        startNodeGuid: { type: 'string', description: 'Starting node GUID' },
        depth: { type: 'number', description: 'Maximum traversal depth (default 2)' }
      },
      required: ['startNodeGuid']
    }
  },
  {
    name: 'xworkspace_assert_relation',
    description: 'Assert a typed directional relation between two nodes in the entity graph.',
    inputSchema: {
      type: 'object',
      properties: {
        fromNodeGuid: { type: 'string', description: 'Source node GUID' },
        toNodeGuid: { type: 'string', description: 'Target node GUID' },
        relationType: {
          type: 'string',
          enum: ['references', 'contains', 'implements', 'derived_from', 'authored_by', 'documents', 'blocks', 'supersedes', 'relates_to']
        }
      },
      required: ['fromNodeGuid', 'toNodeGuid', 'relationType']
    }
  },
  {
    name: 'xworkspace_write_back',
    description: 'Update content on a federated node with optimistic concurrency version checking.',
    inputSchema: {
      type: 'object',
      properties: {
        nodeGuid: { type: 'string', description: 'Node GUID' },
        baseVersionHash: { type: 'string', description: 'Base version hash previously read' },
        newContent: { type: 'string', description: 'New markdown or text content' }
      },
      required: ['nodeGuid', 'baseVersionHash', 'newContent']
    }
  }
];

export function handleRpc(req: JsonRpcRequest, apiBaseUrl = process.env.XWORKSPACE_API_URL || 'http://127.0.0.1:8788'): JsonRpcResponse {
  if (req.method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id: req.id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
          resources: {},
          prompts: {}
        },
        serverInfo: {
          name: 'xworkspace-mcp',
          version: '0.1.0'
        }
      }
    };
  }

  if (req.method === 'tools/list') {
    return {
      jsonrpc: '2.0',
      id: req.id,
      result: {
        tools: TOOLS
      }
    };
  }

  if (req.method === 'resources/list') {
    return {
      jsonrpc: '2.0',
      id: req.id,
      result: {
        resources: [
          {
            uri: 'xworkspace://canon/graph',
            name: 'Evergreen AI Canonical Graph',
            mimeType: 'application/json'
          }
        ]
      }
    };
  }

  return {
    jsonrpc: '2.0',
    id: req.id,
    error: {
      code: -32601,
      message: `Method not found: ${req.method}`
    }
  };
}
import { fileURLToPath } from 'node:url';

const isMain = process.argv[1] && (import.meta.url === `file://${process.argv[1]}` || fileURLToPath(import.meta.url) === process.argv[1]);
if (isMain) {
  const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: false });
  rl.on('line', line => {
    if (!line.trim()) return;
    try {
      const parsed = JSON.parse(line) as JsonRpcRequest;
      const response = handleRpc(parsed);
      process.stdout.write(JSON.stringify(response) + '\n');
    } catch (e: any) {
      process.stdout.write(JSON.stringify({ jsonrpc: '2.0', error: { code: -32700, message: 'Parse error' } }) + '\n');
    }
  });
}
