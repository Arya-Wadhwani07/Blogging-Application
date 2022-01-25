const Query = {
    users(parent, args, { db }, info) {
        if (!(args.query)) {
            console.log(db)
            return db.users
        }
        return db.users.filter((user) => {
            return user.name.toLowerCase().includes(args.query.toLowerCase())
        })
    },
    posts(parent, args, { db }, info) {
        if (!(args.query)) {
            return db.posts
        }
        
        return db.posts.filter((post) => {
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
    comments(parent, args, { db }, info) {
        return db.comments
    }
}

export { Query as default }