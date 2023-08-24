import { join } from 'node:path';
import { readFile } from 'node:fs/promises';
import { createPromiseClient } from '@bufbuild/connect';
import { fastifyConnectPlugin } from '@bufbuild/connect-fastify';
import { createConnectTransport } from '@bufbuild/connect-node';
import Fastify from 'fastify';
import pino from 'pino';
import * as prettier from 'prettier';
import { PlatformService } from '@wundergraph/cosmo-connect/dist/platform/v1/platform_connect';
import { EnumStatusCode } from '@wundergraph/cosmo-connect/dist/common_pb';
import { joinLabel } from '@wundergraph/cosmo-shared';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import database from '../src/core/plugins/database';
import routes from '../src/core/routes';
import {
  afterAllSetup,
  beforeAllSetup,
  createTestAuthenticator,
  genID,
  genUniqueLabel,
  seedTest,
} from 'src/core/test-util';

let dbname = '';

describe('ComposeFederationV1Graphs', (ctx) => {
  beforeAll(async () => {
    dbname = await beforeAllSetup();
  });

  afterAll(async () => {
    await afterAllSetup(dbname);
  });

  test('Compose these federation v1 subgraph schemas', async (testContext) => {
    const databaseConnectionUrl = `postgresql://postgres:changeme@localhost:5432/${dbname}`;
    const server = Fastify();

    await server.register(database, {
      databaseConnectionUrl,
      debugSQL: false,
    });

    testContext.onTestFailed(async () => {
      await server.close();
    });

    const { authenticator, userTestData } = createTestAuthenticator();

    await server.register(fastifyConnectPlugin, {
      routes: routes({
        db: server.db,
        logger: pino(),
        authenticator,
        jwtSecret: 'secret',
        keycloak: {
          realm: 'test',
          adminUser: 'admin',
          adminPassword: 'changeme',
          apiUrl: 'http://localhost:8080',
          frontendUrl: 'http://localhost:8080',
          clientId: 'studio',
        },
      }),
    });

    const addr = await server.listen({
      port: 0,
    });

    await seedTest(databaseConnectionUrl, userTestData);

    const transport = createConnectTransport({
      httpVersion: '1.1',
      baseUrl: addr,
    });

    const pandasSchema = await readFile(join(process.cwd(), 'test/graphql/federationV1/pandas.graphql'));
    const productsSchema = await readFile(join(process.cwd(), 'test/graphql/federationV1/products.graphql'));
    const inventorySchema = await readFile(join(process.cwd(), 'test/graphql/federationV1/inventory.graphql'));
    const usersSchema = await readFile(join(process.cwd(), 'test/graphql/federationV1/users.graphql'));

    const client = createPromiseClient(PlatformService, transport);
    const federatedGraphName = genID();
    const subgraphName = genID();
    const label = genUniqueLabel();

    const createFederatedGraphResp = await client.createFederatedGraph({
      name: federatedGraphName,
      labelMatchers: [joinLabel(label)],
      routingUrl: 'http://localhost:8081',
    });
    expect(createFederatedGraphResp.response?.code).toBe(EnumStatusCode.OK);

    let resp = await client.createFederatedSubgraph({
      name: 'pandas',
      labels: [label],
      routingUrl: 'http://localhost:8000',
    });
    expect(resp.response?.code).toBe(EnumStatusCode.OK);

    let publishResp = await client.publishFederatedSubgraph({
      name: 'pandas',
      schema: pandasSchema,
    });
    expect(publishResp.response?.code).toBe(EnumStatusCode.OK);

    resp = await client.createFederatedSubgraph({
      name: 'users',
      labels: [label],
      routingUrl: 'http://localhost:8002',
    });
    expect(resp.response?.code).toBe(EnumStatusCode.OK);

    publishResp = await client.publishFederatedSubgraph({
      name: 'users',
      schema: usersSchema,
    });
    expect(publishResp.response?.code).toBe(EnumStatusCode.OK);

    resp = await client.createFederatedSubgraph({
      name: 'products',
      labels: [label],
      routingUrl: 'http://localhost:8001',
    });
    expect(resp.response?.code).toBe(EnumStatusCode.OK);

    publishResp = await client.publishFederatedSubgraph({
      name: 'products',
      schema: productsSchema,
    });
    expect(publishResp.response?.code).toBe(EnumStatusCode.OK);

    resp = await client.createFederatedSubgraph({
      name: 'inventory',
      labels: [label],
      routingUrl: 'http://localhost:8002',
    });
    expect(resp.response?.code).toBe(EnumStatusCode.OK);

    resp = await client.publishFederatedSubgraph({
      name: 'inventory',
      schema: inventorySchema,
    });
    expect(resp.response?.code).toBe(EnumStatusCode.OK);

    const graph = await client.getFederatedGraphByName({
      name: federatedGraphName,
    });

    expect(graph.response?.code).toBe(EnumStatusCode.OK);
    expect(graph.graph?.compositionErrors).toBe('');
    expect(graph.graph?.isComposable).toBe(true);

    const fetchSchemaResp = await client.getFederatedGraphSDLByName({
      name: federatedGraphName,
    });
    expect(fetchSchemaResp.response?.code).toBe(EnumStatusCode.OK);

    const composedFederatedGraphSchema = await readFile(
      join(process.cwd(), 'test/graphql/federationV1/composedFederatedV1Graph.graphql'),
      { encoding: 'utf8' },
    );
    let formattedFederatedSchemaSDL = '';
    if (fetchSchemaResp.sdl) {
      formattedFederatedSchemaSDL = prettier.format(fetchSchemaResp.sdl, {
        parser: 'graphql',
      });
    }
    expect(formattedFederatedSchemaSDL).toBe(composedFederatedGraphSchema);

    await server.close();
  });
});