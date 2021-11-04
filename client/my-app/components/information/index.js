export default function InformationPane(props) {

    const { ProxySearch } = props
    return (
        <section className='w-full h-full flex flex-col gap-2 bg-gray-900  text-gray-300 p-1 rounded-md'>
            <h1 className='self-center my-3'><span className='bg-gray-700 py-1 px-2 rounded-md'>Proxy Search</span></h1>
            {ProxySearch && <ProxySearch />}
        </section>
    )
}