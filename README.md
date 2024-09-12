<p align="center">
<img width="350" src="./docs/assets/logo.png"/>
</p>

<div align="center">
<h5>WunderGraph Cosmo - The GraphQL Federation Platform</h5>
<h6><i>Reach for the stars, ignite your cosmo!</i></h6>
</div>

<p align="center">
  <a href="https://cosmo-docs.wundergraph.com/tutorial/cosmo-cloud-onboarding"><strong>Quickstart</strong></a> ·
  <a href="/examples"><strong>Examples</strong></a> ·
  <a href="https://cosmo-docs.wundergraph.com"><strong>Docs</strong></a> ·
  <a href="https://cosmo-docs.wundergraph.com/cli"><strong>CLI</strong></a> ·
  <a href="https://wundergraph.com/discord"><strong>Community</strong></a> ·
  <a href="https://github.com/wundergraph/cosmo/releases"><strong>Changelog</strong></a> ·
  <a href="https://wundergraph.com/jobs"><strong>Hiring</strong></a>
</p>

## Overview

WunderGraph Cosmo is a comprehensive Lifecycle API Management platform tailored for Federated GraphQL. It encompasses everything from Schema Registry, composition checks, and analytics, to metrics, tracing, and routing. Whether you’re looking to deploy 100% on-prem or prefer a [Managed Service](https://cosmo.wundergraph.com/login), Cosmo offers flexibility without vendor lock-in, all under the Apache 2.0 license.

### Why Federated GraphQL?

GraphQL Federation empowers organizations to break down their GraphQL schema into multiple smaller, manageable schemas, each maintained by different teams or services. These individual schemas are then combined into a single, unified graph, ensuring that all teams have consistent access to the data they need. In today's data-driven world, where information is often referred to as the new oil, building a unified API that can be consumed by both internal and external teams is more crucial than ever.

Not all companies start with a federated architecture, Cosmo supports both monolithic and federated architectures.

## Getting Started

To get started with WunderGraph Cosmo, follow these steps:

1. **Clone the Repository**: `git clone https://github.com/wundergraph/cosmo.git`
2. **Choose your Example**: Select the example that best fits your role and use case from the [Try Cosmo Now](#try-cosmo-now) section and follow the instructions.
3. **Explore Further**: Check out the [Docs](https://cosmo-docs.wundergraph.com) for more information on Cosmo's features and capabilities.

## Try Cosmo Now! :rocket:

Get started with Cosmo by choosing the example that best fits your role and use case:

- [**Developer**](examples/router-simple/README.md): Quickly start with Cosmo by composing a federated GraphQL schema locally from multiple services and running the Cosmo Router.
- [**Architect**](./examples/full-cosmo-docker/README.md): Evaluate the entire Cosmo Platform for your organization by running it locally with Docker Compose.
- [**Platform Engineer**](examples/full-cosmo-helm/README.md): Deploy the entire Cosmo Platform to Kubernetes through our official Helm Chart.
- [**Decision Maker (e.g. Engineering Manager, CTO)**](https://wundergraph.com/contact/sales): Get in touch with the founders to discuss how Cosmo can help your organization.

_For any questions, feedback, or support, please [contact](https://wundergraph.com/contact/sales) us._

<br>
<p align="center">
<a href="https://cosmo.wundergraph.com">
<img width="250" src="./docs/assets/cta_readme.png"/>
</a>
</p>

## Contributing

We welcome contributions from the community! Whether it's fixing a bug, adding new features, or improving documentation, your help is greatly appreciated. Please take a look in our [Contributing Guide](CONTRIBUTING.md) to get started.


## Local Stress Testing Setup

Start Infrastructure
```
make edfs-infra-up
docker compose --file docker-compose.sergio.yml --profile dev up --detach
```

Subgraph running:
```
cd demo/cmd/all
go run main.go 
```

The firewall request should appear and it needs to be allowed.

Please note the terminal would not print any console output in case of success


## Apollo Router Setup 

```
cd apollo
```
Installation
```
curl -sSL https://router.apollo.dev/download/nix/latest | sh
```
Execution
```
./router --config router.yml --supergraph supergraph.yml &
```

## Cosmo Router Setup
```
cd router
go run cmd/router/main.go 
```
Please note the terminal would not print any console output in case of success

## Grafbase Router Setup

Installation requires `bun` under the folder `~/.grafbase/bun/bun`


[This](https://github.com/grafbase/grafbase/issues/2046#issuecomment-2305165777) is the workaround approach recommended by the grafbase developer

[Download the binary](https://github.com/oven-sh/bun/releases/tag/bun-v1.1.17) for your reference architecture

and copy it under `~/.grafbase/bun/bun` 

Add `~/.grafbase/bun/bun` to your `PATH`


Run grafbase
```
➜ cd grafbase
➜ grafbase dev &
Grafbase CLI 0.79.0

📡 Listening on port 4000

Run grafbase publish --dev to add subgraphs to the federated graph

- Pathfinder: http://127.0.0.1:4000
- Endpoint:   http://127.0.0.1:4000/graphql

❌ Failed to compose schema after adding subgraph availability. Errors:
- None of the subgraphs defines root query fields.
🧩 Successfully composed schema after adding subgraph employees
🧩 Successfully composed schema after adding subgraph family
🧩 Successfully composed schema after adding subgraph hobbies
🧩 Successfully composed schema after adding subgraph mood
🧩 Successfully composed schema after adding subgraph products
🧩 Successfully composed schema after adding subgraph test1
```

To perform the stress tests please check the relative [README.md](router-tests/testdata/queries/README.md) file

## License

Cosmo is licensed under the [Apache License, Version 2.0](LICENSE).