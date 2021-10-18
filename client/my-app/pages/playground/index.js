
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
            <ResponsiveLayout viewData={{}} />
        </div>
    )
}


export async function getServerSideProps() {

    const { data, error } = await serverClient.query({ query: ALL_USERS, fetchPolicy: "network-only" });
    if (error) {
        console.log("Error retrieving data in the Playground", error)
    }

    return {
        props: { users: data.users }, // will be passed to the page component as props
    }
}



{/* <main className={styles.main}>
    <h1 className={styles.title}>
        Welcome to the Playground!
    </h1>
    <p className={styles.description}>
        Currently we are testing the servers ability to grab our IP address.
    </p>
    <p className={styles.description}>
        Select an option from below to fetch information from the server
    </p>
    <div className={styles.grid}>
        <Link href="/">
            <a className={styles.card}>
                <h2>Go Home &rarr;</h2>
                <p>Click here to go home</p>
            </a>
        </Link>
        <a className={styles.card}
        >
            <h2>Fetch All Users &#128225;</h2>
            <Client>
                <Test allUsers={users} />
            </Client>
        </a>

    </div>
</main> */}