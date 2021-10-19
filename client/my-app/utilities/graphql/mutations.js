import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
    token
    user {
        _id
        username
        email
    }
}
}
`;

export const CREATE_USER = gql`
mutation AddUser($username: String!, $email: String!, $password: String!, $latitude: String, $city: String, $state: String, $longitude: String, ) {
    addUser(username: $username, email: $email, password: $password, latitude: $latitude, city: $city, state: $state, longitude: $longitude) {
    token
    user {
        _id
        username
    }
}
}
`;