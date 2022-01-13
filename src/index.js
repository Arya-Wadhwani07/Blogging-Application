import { GraphQLServer } from 'graphql-yoga'

const users = [{
    id: '1',
    name: 'Arya',
    email: 'arya@example.com',
    age: 19
}, {
    id: '2',
    name: 'Andrew',
    email: 'andrew@example.com',
    age: 27
}, {
    id: '3',
    name: 'Sarah',
    email: 'sarah@example.com'
}]

const posts = [{
    id: '1',
    title: 'Course1',
    body: 'This is course 1',
    published: false
}, {
    id: '2',
    title: 'Course2',
    body: 'This is course 2',
    published: true
}, {
    id: '3',
    title: 'Course3',
    body: 'This is course 3',
    published: false
}]

const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        post: Post!
        posts(query: String): [Post!]!
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
        users(parent, args, ctx, info) {
            if (!(args.query)) {
                return users
            }

            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        posts(parent, args, ctx, info) {
            if (!(args.query)) {
                return posts
            }

            return posts.filter((post) => {
                if (post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase())) {
                    return true
                }
                return false
            })
        },
        me() {
            return {
                id: 'abcd1234',
                name: 'Mike Hannigan',
                email: 'mike@example.com',
                age: 27
            }
        },
        post() {
            return {
                id: 'abcdef123456',
                title: 'The Subtle Art of Greatness',
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

server.start(() => {
    console.log('The server is up!')
})