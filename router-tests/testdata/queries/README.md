### Stress Testing Execution

This folder contains various graph examples that can be executed to help verify router behaviors.

### [Hey](https://github.com/rakyll/hey) Testing 

```
brew install hey
```
### Queries folder

```
cd testdata/queries
```
### Running Query towards Apollo

```
hey -n 200 -z 10s -m POST -H 'Accept: application/json' -H 'Content-Type: application/json' -D big.json http://localhost:3011
```

### Running Query towards Cosmo

```
hey -n 200 -z 10s -m POST -H 'Accept: application/json' -H 'Content-Type: application/json' -D big.json http://localhost:3002/graphql
```

### Running Query towards Grafbase

```
hey -n 200 -z 10s -m POST -H 'Accept: application/json' -H 'Content-Type: application/json' -D big.json http://localhost:4000/graphql
```