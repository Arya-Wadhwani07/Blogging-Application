import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

let users = [{
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

let posts = [{
    id: '1',
    title: 'Course1',
    body: 'This is course 1',
    published: false,
    author: '1'
}, {
    id: '2',
    title: 'Course2',
    body: 'This is course 2',
    published: true,
    author: '1'
}, {
    id: '3',
    title: 'Course3',
    body: 'This is course 3',
    published: false,
    author: '2'
}]

let comments = [{
    id: '1',
    text: 'This is the first comment',
    author: '1',
    post: '1'
}, {
    id: '2',
    text: 'This is the second comment',
    author: '1',
    post: '2'
}, {
    id: '3',
    text: 'This is the third comment',
    author: '2',
    post: '3'
}, {
    id: '4',
    text: 'This is the fourth comment',
    author: '3',
    post: '1'
}]


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
        comments() {
            return comments
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some((user) => user.email == args.data.email)

            if (emailTaken) {
                throw new Error('Email taken!')
            }

            const user = {
                id: uuidv4(),
                ...args.data
            }

            users.push(user)
            return user
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex((user) => user.id == args.id)
            if (userIndex == -1) {
                throw new Error("User not found!")
            }
            const deletedUsers = users.splice(userIndex, 1)

            posts = posts.filter((post) => {
                const match = post.author === args.id
                if (match) {
                    comments = comments.filter((comment) => { comment.post !== post.id })
                }
                return !match
            })

            comments = comments.filter((comment) => { comment.author !== args.id })
            return deletedUsers[0]
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id == args.data.author)
            if (!userExists) {
                throw new Error("User does not exist!")
            }

            const post = {
                id: uuidv4(),
                ...args.data
            }

            posts.push(post)

            return post
        },
        deletePost(parent, args, ctx, info) {
            const postIndex = posts.findIndex((post) => post.id == args.id)

            if (postIndex == -1) {
                throw new Error("Post not found!")
            }

            const deletedPosts = posts.splice(postIndex, 1)
            comments = comments.filter((comment) => comment.post !== args.id)

            return deletedPosts[0]
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id == args.data.author)
            if (!userExists) {
                throw new Error("User does not exist!")
            }

            const postExists = posts.some((post) => post.id == args.data.post && post.published)
            if (!postExists) {
                throw new Error("Post does not exist!")
            }

            const comment = {
                id: uuidv4(),
                ...args.data
            }

            comments.push(comment)
            return comment
        },
        deleteComment(parent, args, ctx, info){
            const commentIndex = comments.findIndex((comment)=>comment.id == args.id)
            if(commentIndex==-1){
                throw new Error("Comment not found!")
            }
            
            const deletedComment = comments.splice(commentIndex,1)

            return deletedComment[0]
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id == parent.author
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.post == parent.id
            })
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author == parent.id
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.author == parent.id
            })
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id == parent.author
            })
        },
        post(parent, args, ctx, info) {
            return posts.find((post) => {
                return post.id == parent.post
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers
})

server.start(() => {
    console.log('The server is up!')
})