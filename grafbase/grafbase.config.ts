import { config, graph } from '@grafbase/sdk'

export default config({
    graph: graph.Federated({
        subgraphs: [
            {
                name: 'employees',
                url: 'http://127.0.0.1:4001/graphql'
            },
            {
                name: 'family',
                url: 'http://localhost:4002/graphql'
            },
            {
                name: 'hobbies',
                url: 'http://localhost:4003/graphql'
            },
            {
                name: 'products',
                url: 'http://localhost:4004/graphql'
            },
            {
                name: 'availability',
                url: 'http://localhost:4007/graphql'
            },
            {
                name: 'mood',
                url: 'http://localhost:4008/graphql'
            },
            {
                name: 'test1',
                url: 'http://localhost:4006/graphql'
            }
        ]
    }),
})