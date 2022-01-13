import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

const users = [{
    id: '1',
    name: 'Arya',
    email: 'arya@example.com',
    age: 19,
}, {
    id: '2',
    name: 'Andrew',
    email: 'andrew@example.com',
    age: 27,
}, {
    id: '3',
    name: 'Sarah',
    email: 'sarah@example.com'
}]

const posts = [{
    id: '1',
    title: 'Course1',
    body: 'This is course 1',
    published: false,
    author:'1'
}, {
    id: '2',
    title: 'Course2',
    body: 'This is course 2',
    published: true,
    author:'1'
}, {
    id: '3',
    title: 'Course3',
    body: 'This is course 3',
    published: false,
    author:'2'
}]

const comments = [{
    id:'1',
    text:'This is the first comment',
    author:'1',
    post:'1'
}, {
    id:'2',
    text:'This is the second comment',
    author:'1',
    post:'2'
}, {
    id:'3',
    text:'This is the third comment',
    author:'2',
    post:'3'
}, {
    id:'4',
    text:'This is the fourth comment',
    author:'3',
    post:'1'
}]

const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        post: Post!
        posts(query: String): [Post!]!
        comments:[Comment!]!
    }

    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!
        createPost(title:String!, body: String!, published: Boolean!, author: ID!): Post!
        createComment(text: String!, author: ID!, post: ID!): Comment!
    }
    
    type User {
        id: ID!,
        name: String!,
        email: String!,
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!,
        title: String!,
        body: String!,
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!,
        text: String!
        author: User!
        post: Post!
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
        },
        comments(){
            return comments
        }
    },
    Mutation:{
        createUser(parent, args, ctx, info){
            const emailTaken = users.some((user)=>user.email == args.email)

            if(emailTaken){
                throw new Error('Email taken!')
            }

            const user = {
                id:uuidv4(),
                name:args.name,
                email:args.email,
                age: args.age
            }

            users.push(user)
            return user
        },
        createPost(parent, args, ctx, info){
            const userExists = users.some((user)=>user.id == args.author)
            if(!userExists){
                throw new Error("User does not exist!")
            }

            const post = {
                id:uuidv4(),
                title:args.title,
                body:args.body,
                published:args.published,
                author:args.author
            }

            posts.push(post)

            return post
        },
        createComment(parent, args, ctx, info){
            const userExists = users.some((user)=>user.id == args.author)
            if(!userExists){
                throw new Error("User does not exist!")
            }

            const postExists = posts.some((post)=>post.id == args.post && post.published)
            if(!postExists){
                throw new Error("Post does not exist!")
            }

            const comment = {
                id:uuidv4(),
                text:args.text,
                author:args.author,
                post:args.post
            }

            comments.push(comment)
            return comment
        }
    },
    Post: {
        author(parent, args, ctx, info){
            return users.find((user)=>{
                return user.id == parent.author
            })
        },
        comments(parent, args, ctx, info){
            return comments.filter((comment)=>{
                return comment.post == parent.id
            })
        }
    },
    User:{
        posts(parent, args, ctx, info){
            return posts.filter((post)=>{
                return post.author == parent.id
            })
        },
        comments(parent, args, ctx, info){
            return comments.filter((comment)=>{
                return comment.author == parent.id
            })
        }
    },
    Comment:{
        author(parent, args, ctx, info){
            return users.find((user)=>{
                return user.id == parent.author
            })
        },
        post(parent, args, ctx, info){
            return posts.find((post)=>{
                return post.id==parent.post
            })
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