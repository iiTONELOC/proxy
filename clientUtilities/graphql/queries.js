import { gql } from '@apollo/client';

export const ALL_USERS = gql`
query users {
  users{
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
      profilePicture
      bio
      visible
      _id
    }
    status {
      _id
      online
      status
    }
    friends {
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
        _id
        bio
        visible
        profilePicture
      }
      status {
        _id
        online
        status
      }
      servers {
        name
        description
        _id
        private
        channels {
          _id
          name
          description
          private
          server
        }
      }
    }
    friendCount
    usersInRange {
      _id
      username
      location {
        latitude
        longitude
        city
        state
      }
      profile {
        _id
        username
        bio
        visible
        profilePicture
      }
    }
  }
}
`;
export const QUERY_FRIENDS = gql`
query Query {
  friends {
    
    friends{
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
      _id
        profilePicture
        visible
        bio
    }
    status {
      _id
      online
      status
    }
    servers {
      _id
      private
    }
    friendCount
    socket
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
        _id
        online
        status
      }
      friendCount
      socket
    }
    socket
    incomingRequests {
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
        _id
        profilePicture
        visible
        bio
      }
      socket
    }
    pendingRequests {
      _id
      username
      socket
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
        latitude
        longitude
        _id
      }
      profile {
        profilePicture
      }
    }
  }
}
`;
export const QUERY_FRIEND_REQUESTS = gql`
query Query {
  friendRequests {
    incomingRequests{
    _id
    username
    location {
      _id
      city
      state
    }
    profile {
      profilePicture
      _id
    }
    status {
      _id
      online
      status
    }
    socket
    friendCount
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
export const CAL_DISTANCE = gql`
query Query($lat1: String!, $lon1: String!, $lat2: String, $lon2: String) {
  getDistance(lat1: $lat1, lon1: $lon1, lat2: $lat2, lon2: $lon2) {
    distance
  }
}
`;