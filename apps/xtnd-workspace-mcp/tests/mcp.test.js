import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleRpc } from '../src/index.js';
test('MCP Server: responds to initialize method with capabilities and serverInfo', () => {
    const response = handleRpc({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {}
    });
    assert.equal(response.id, 1);
    assert.ok(response.result);
    assert.equal(response.result.serverInfo.name, 'xworkspace-mcp');
    assert.ok(response.result.capabilities.tools);
});
test('MCP Server: lists graph tools (search, get, query, assert, write_back)', () => {
    const response = handleRpc({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list'
    });
    assert.equal(response.id, 2);
    const tools = response.result.tools;
    assert.ok(Array.isArray(tools));
    assert.ok(tools.some((t) => t.name === 'xworkspace_search_nodes'));
    assert.ok(tools.some((t) => t.name === 'xworkspace_query_graph'));
    assert.ok(tools.some((t) => t.name === 'xworkspace_write_back'));
});
//# sourceMappingURL=mcp.test.js.map