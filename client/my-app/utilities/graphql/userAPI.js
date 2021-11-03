import client from "../apollo/client.config";
import { QUERY_IN_RANGE, QUERY_FRIEND_REQUESTS, QUERY_FRIENDS } from "./queries";
import { reduxSetUsersInRange, reduxUpdateIncomingFriendRequests, reduxSetMyFriends } from '../redux/helpers';


export async function getUsersInRange(dispatch) {
    const { data } = await client.query({ query: QUERY_IN_RANGE, fetchPolicy: 'network-only' });
    return reduxSetUsersInRange({ data: data.inRange.usersInRange, dispatch });
};
export async function getFriendRequests(dispatch) {
    const { data, error } = await client.query({ query: QUERY_FRIEND_REQUESTS, fetchPolicy: 'network-only' });
    reduxUpdateIncomingFriendRequests({ data: data.friendRequests, dispatch });
}
export async function getMyFriendsList(dispatch) {
    const { data, error } = await client.query({ query: QUERY_FRIENDS, fetchPolicy: 'network-only' });
    console.log(`GETTING FRIENDS`, data.friends.friends)
    reduxSetMyFriends({ data: data.friends.friends, dispatch });
}