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