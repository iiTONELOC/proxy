
import Head from 'next/head';
import Test from '../../components/Test'
import ResponsiveLayout from '../../components/layouts/Responsive';
import { ALL_USERS } from '../../utilities/graphql/queries';

import serverClient from '../../utilities/apollo/server.config';
export default function Playground({ users }) {

    return (
        <div>
            <Head>
                <title>Proxy-Playground</title>
                <meta name="Proxy's texting ground" content="Testing container for app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ResponsiveLayout viewData={{ Test: { Element: Test, props: users } }} />
        </div>
    )
}


export async function getServerSideProps() {
    const { data, error } = await serverClient.query({ query: ALL_USERS, fetchPolicy: "network-only" });
    if (error) {
        console.log("Error retrieving data in the Playground", error)
    }
    console.log('fetching users')
    return {
        props: { users: data.users }, // will be passed to the page component as props
    }
}