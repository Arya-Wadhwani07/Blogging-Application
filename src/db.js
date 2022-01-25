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

const comments = [{
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

const db = {
    users,
    posts,
    comments
}


export { db as default }

