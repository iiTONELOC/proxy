import { gql } from '@apollo/client';

export const ALL_USERS = gql`
query users {
  users{
    username
    location{
      latitude
      longitude
      city
      state
    }
    profile {
      bio
      visible
      ProfilePicture
    }
    status{
      online
      status
    }
    servers {
      _id
      name
      description
      private
      channels {
        _id
        name
        description
        private
        messages {
          _id
          text
          time
          sender
        }
        active {
          _id
          username
          status {
            status
          }
        }
        members {
          _id
          username
        }
      }
    }
  }
}
`;
export const QUERY_IN_RANGE = gql`
query Query {
  inRange {
    usersInRange {
      _id
      username
      socket
      location {
        city
        state
        _id
      }
    }
  }
}
`;
export const SERVER_SIDE_FETCH_USER = gql`
query Query($user: ID) {
  user(user: $user) {
    _id
    username
    socket
    usersInRange {
      _id
      username
      socket
      status {
        online
        status
      }
      location {
        _id
        latitude
        longitude
        city
        state
      }
    }
    incomingRequests {
      _id
      username
      profile {
        _id
        bio
        visible
        ProfilePicture
      }
      location {
        latitude
        longitude
        city
        state
      }
    }
    pendingRequests {
      _id
      username
    }
    location{
      city,
      state
    }
    friends{
      _id
      username
    }
    profile{
      _id
      bio
    }
    status{
      online
      status
    }
  }
}
`;

export const SERVER_SIDE_FETCH_GLOBAL_MESSAGES = gql`
query Query {
  globalMessages {
    _id
    channel
    text
    time
    sender
  }
}
`;