import {GraphQLServer} from 'graphql-yoga'

const typeDefs = `
    type Query {
        greeting(name: String, position: Int): String!
        add(a: Float!, b: Float!): String!
        me: User!
        post: Post!
    }
    
    type User {
        id: ID!,
        name: String!,
        email: String!,
        age: Int
    }

    type Post {
        id: ID!,
        title: String!,
        body: String!,
        published: Boolean!
    }
`

const resolvers = {
    Query: {
        greeting(parent, args, ctx, info){
            if(args.name && args.position){
                return `Hello ${args.name}. You are my favourite ${args.position}`
            }
            return `Hello!`
        },
        add(parent,args,ctx,info){
            const sum = args.a+args.b
            return `The sum of ${args.a}+${args.b} = ${sum}`
        },
        me(){
            return {
                id:'abcd1234',
                name: 'Mike Hannigan',
                email:'mike@example.com',
                age:27
            }
        },
        post(){
            return {
                id:'abcdef123456',
                title:'The Subtle Art of Greatness',
                body: 'I am the killer who is born to be great',
                published: false
            }
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(()=>{
    console.log('The server is up!')
})