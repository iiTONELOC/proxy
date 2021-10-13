import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import Client from '../../components/Providers/Client'
import Test from '../../components/Test'

export default function Playground() {

    return (
        <div>
            <Head>
                <title>Proxy-Playground</title>
                <meta name="Proxy's texting ground" content="Testing container for app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
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
                            <Test />
                        </Client>
                    </a>
                    <a href="https://nextjs.org/learn" className={styles.card}>
                        <h2>Learn &rarr;</h2>
                        <p>Learn about Next.js in an interactive course with quizzes!</p>
                    </a>
                    <a
                        href="https://github.com/vercel/next.js/tree/master/examples"
                        className={styles.card}
                    >
                        <h2>Examples &rarr;</h2>
                        <p>Discover and deploy boilerplate example Next.js projects.</p>
                    </a>
                </div>
            </main>
        </div>
    )
}

