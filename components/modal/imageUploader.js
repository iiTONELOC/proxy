import Button from '../Button/Button';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useDropzone } from 'react-dropzone';
import { ADD_PROFILE_PICTURE } from '../../clientUtilities/graphql/mutations';
import { _REDUX_SET_MODAL, _REDUX_SET_PICTURE } from '../../clientUtilities/redux/actions';


export default function ImageUploaderModal({ user, setProfile }) {
    const [uploadProfilePicture] = useMutation(ADD_PROFILE_PICTURE);
    const [errorMessage, setErrorMessage] = useState(false);
    const [uploadedImage, setUploadedImage] = useState({});
    const [file, setFile] = useState({});
    const dispatch = useDispatch();

    const handleUpload = async () => {
        if (file) {
            const { base64 } = { ...file };
            try {
                const didLoad = await uploadProfilePicture({
                    variables: { picture: base64.toString() },
                });
                const { data } = didLoad;
                const pP = data.uploadProfilePicture.profilePicture;
                setUploadedImage(Object.assign(pP, {
                    preview: pP,
                    alt: 'Profile Picture'
                }));
                setFile({});
                dispatch({ type: _REDUX_SET_MODAL, toggle: true });
                if (setProfile) {
                    dispatch({
                        type: _REDUX_SET_PICTURE,
                        picture: pP
                    })
                }
            } catch (error) {
                console.log(error);
            };
        };
    };
    function createErrorMessage(msg) {
        setErrorMessage(msg);
        setTimeout(() => {
            setErrorMessage(false);
        }, 2500);
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/png, ,image/gif, image/jpg, image/jpeg',
        onDrop: async (acceptedFile) => {
            if (acceptedFile.length > 0) {
                const thisFile = acceptedFile[0];
                const { size } = thisFile;
                if (size > 5 * 1024 * 1024) {
                    createErrorMessage('Files must be smaller than 5mb!');
                } else {

                    const toBase = file => new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = error => reject(error);
                    })
                    try {
                        const didConvert = await toBase(acceptedFile[0]);
                        setFile(
                            Object.assign(acceptedFile[0], {
                                preview: URL.createObjectURL(acceptedFile[0]),
                                base64: didConvert
                            }),
                        );

                    } catch (error) {
                        const msg = error.message
                        if (msg === 'FileReader.readAsDataURL: Argument 1 is not an object.') {
                            createErrorMessage('File type not supported!');
                        } else {
                            createErrorMessage(error);
                        }
                    }
                }
            } else {
                // unsupported file type was dropped
                createErrorMessage('File is not supported!');
            }
        },
    });

    useEffect(
        () => () => {
            URL.revokeObjectURL(file.preview);
            URL.revokeObjectURL(uploadedImage.preview);
        },
        [file, uploadedImage],
    );

    const AvatarPreview = (
        <section className='p-1 w-full text-center flex flex-col items-center'>
            {file.preview && (
                <>
                    <p>Profile Preview</p>
                    <span
                        className='mt-8 p-1 bg-black rounded-xl'>
                        <img
                            src={file.preview ? file.preview : uploadedImage ? uploadedImage.preview : null}
                            alt={file.length ? file.length : uploadedImage ? uploadedImage.alt && 'img' : null}
                            style={{ width: '100px', height: '100px' }}
                            className='object-cover rounded-xl border-solid border-gray-900 border-3'
                        />
                    </span>
                </>
            )}
        </section>
    );
    return (
        <div
            className='w-full flex flex-col justify-between gap-3 items-center text-gray-300 bg-gray-800 rounded-md p-2'
        >
            <span {...getRootProps()}
                className='w-full border-2 border-dashed border-green-400 p-2'
            >
                <input {...getInputProps()} />
                <label
                    style={{ minWidth: '350px' }}
                    className={`text-gray-300 self-center text-center text-${errorMessage ? 'red-500' : 'gray-00'}`}
                >
                    {errorMessage ? `${errorMessage}` : `Drag 'n' drop, or click here to upload a profile picture`}
                </label>
            </span>
            {AvatarPreview}
            {
                Object.keys(file).length > 0 &&
                <span className='w-full flex justify-around'>
                    <Button
                        color={{ color: 'green-700', hover: 'green-500' }}
                        radius={'rounded-md'}
                        class='text-white text-center p-2'
                        action={{ onClick: handleUpload }}
                    >
                        Upload
                    </Button>
                    <Button
                        color={{ color: 'red-700', hover: 'red-500' }}
                        radius={'rounded-md'}
                        class='text-white text-center p-2'
                        action={{ onClick: () => setFile({}) }}
                    >
                        Cancel
                    </Button>
                </span>
            }
        </div>
    );
};