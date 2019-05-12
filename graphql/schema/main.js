const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Event {
    _id: ID
    title: String!
    description: String!
    price: Float!
    date: String!
    created_by: User!
}

type User {
    _id: ID
    email: String!
    password: String
    created_events: [Event!]
}

type Booking {
    _id: ID
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}

input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
}

input UserInput {
    email: String!
    password: String!
}

type AuthData {
    userId: ID!
    token: String!
    expiresIn: Int!
}

type RootQuery {
    events: [Event!]!
    users: [User!]!
    bookings: [Booking!]!
    login(email: String!, password: String!): AuthData!
}

type RootMutation {
    createEvent(evInput: EventInput): Event
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): String!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);