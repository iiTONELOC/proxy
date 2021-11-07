import client from "../apollo/client.config";
import { QUERY_IN_RANGE, QUERY_FRIEND_REQUESTS, QUERY_FRIENDS, CAL_DISTANCE } from "./queries";
import { reduxSetUsersInRange, reduxUpdateIncomingFriendRequests, reduxSetMyFriends } from '../redux/helpers';


export async function getUsersInRange(dispatch) {
    const { data } = await client.query({ query: QUERY_IN_RANGE, fetchPolicy: 'network-only' });
    if (data?.inRange?.usersInRange) {
        return reduxSetUsersInRange({ data: data.inRange.usersInRange, dispatch });
    };
}

export async function getFriendRequests(dispatch) {
    const { data, error } = await client.query({ query: QUERY_FRIEND_REQUESTS, fetchPolicy: 'network-only' });

    if (data?.friendRequests?.incomingRequests) {
        return reduxUpdateIncomingFriendRequests({ data: data.friendRequests.incomingRequests, dispatch });
    }

}
export async function getMyFriendsList(dispatch) {
    const { data, error } = await client.query({ query: QUERY_FRIENDS, fetchPolicy: 'network-only' });
    if (data?.friends?.friends) {
        return reduxSetMyFriends({ data: data.friends.friends, dispatch });
    }

}
export async function calculateDistance(args) {
    const { data } = await client.query({ query: CAL_DISTANCE, fetchPolicy: 'network-only', variables: { ...args } });
    if (data?.getDistance?.distance) {
        return data.getDistance.distance;
    }
}
