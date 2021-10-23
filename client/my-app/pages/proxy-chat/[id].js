import Head from 'next/head';
import UsersInRange from '../../components/UsersInRange'
import ResponsiveLayout from '../../components/responsive-layout/Responsive';
import { SERVER_SIDE_FETCH_USER } from '../../utilities/graphql/queries';
import serverClient from '../../utilities/apollo/server.config';
import Authorization from '../../components/Providers/Auth';


export default function Global_Chat({ userData }) {

    return (
        <Authorization>
            <div>
                <Head>
                    <title>Proxy-Chat</title>
                    <meta name="Proxy's texting ground" content="Testing container for app" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <ResponsiveLayout viewData={{ UsersInRange: { Element: UsersInRange, props: userData?.usersInRange } }} />
            </div>
        </Authorization>
    );
};


export async function getServerSideProps(req) {
    // const userID = req.socket.parser.incoming.url.split('/')[2];
    const { id } = req.params

    const { data, error } = await serverClient
        .query(
            {
                query: SERVER_SIDE_FETCH_USER,
                variables: { user: id },
                fetchPolicy: "network-only"
            }
        );
    if (error) {
        console.log("Error retrieving data in the Global-Chat", error)
    };

    return {
        props: { userData: data.user }, // will be passed to the page component as props
    };
};

