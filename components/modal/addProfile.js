import { useEffect, useState } from "react";
import { BsInfoCircle } from "react-icons/bs";
import ProfileForm from '../forms/addProfile';
import ImageUploaderModal from "./imageUploader";



export default function AddProfileModal({ user }) {
    const [isMounted, setMounted] = useState(false);
    const [addedBio, setBio] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);
    if (isMounted === false) return null;

    return (
        <section className='w-full flex flex-col justify-start gap-3 items-center text-gray-300 bg-gray-800 rounded-md p-2'>
            <h1>Add Profile</h1>
            <div className='w-full flex flex-col justify-between items-start'>
                {!addedBio && <ProfileForm user={user} parentState={() => setBio(!addedBio)} />}
                {addedBio && <ImageUploaderModal user={user} />}
            </div>
        </section>
    );
};


