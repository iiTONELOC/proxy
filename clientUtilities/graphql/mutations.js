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
mutation AddUser($username: String!, $email: String!, $password: String!, $latitude: String,$longitude: String, ) {
    addUser(username: $username, email: $email, password: $password, latitude: $latitude, longitude: $longitude) {
    token
    user {
        _id
        username
    }
}
}
`;

export const LOGOUT = gql`
mutation Mutation {
  logout {
  _id
  username
  }
}
`;
export const ADD_FRIEND = gql`
mutation addFriend($friendId: ID!) {
    addFriend(friendId: $friendId) {
        _id
    username
  }
}
`;
export const REJECT_FRIEND = gql`
mutation rejectFriend($friendId: ID!) {
    rejectFriend(friendId: $friendId) {
        _id
    username
  }
}
`;
export const REMOVE_FRIEND = gql`
mutation removeFriend($friendId: ID!) {
    removeFriend(friendId: $friendId) {
        _id
    username
  }
}
`;

export const ADD_PROFILE_PICTURE = gql`
mutation Mutation($picture: String!) {
  uploadProfilePicture(picture: $picture) {
    _id
    username
    bio
    visible
    location
    profilePicture
  }
}
`;
export const ACCEPT_FRIEND = gql`
mutation Mutation($friendId: ID!) {
  acceptFriend(friendId: $friendId) {
    _id
    username
    location {
      latitude
      longitude
      city
      state
    }
    profile {
      username
      bio
      visible
      profilePicture
    }
    status {
      online
      status
    }
    servers {
      name
      description
      private
      channels {
        _id
        name
        description
        private
      }
    }
    friends {
      _id
      username
      socket
      location {
        latitude
        longitude
        _id
        city
        state
      }
      }
      friendCount
      status {
        online
        status
      }
    
    friendCount
    usersInRange {
      _id
      username
      location {
        _id
        latitude
        longitude
        city
        state
      }
      profile {
        bio
        visible
        profilePicture
      }
      status {
        online
        status
      }
      socket
    }
    socket
    incomingRequests {
      _id
      username
      location {
        _id
        city
        state
        latitude
        longitude
      }
      profile {
        bio
        visible
        profilePicture
      }
      status {
        online
        status
      }
    }
  }
}
`;
