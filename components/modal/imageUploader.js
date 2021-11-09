import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import Button from '../Button/Button';
// import { Box, Text, Image, Avatar } from 'grommet';
// import { UPLOAD_IMAGE } from '../../utils/db/mutations';
import { useDropzone } from 'react-dropzone';
import { ADD_PROFILE_PICTURE } from '../../utilities/graphql/mutations';
export default function ImageUploaderModal({ user, setProfile }) {
    // renders preview off file in state
    const [file, setFile] = useState({});
    // informs user if file isn't supported
    const [errorMessage, setErrorMessage] = useState(false);
    // image retrieved from DB after it has been uploaded
    // currently used in testing
    const [uploadedImage, setUploadedImage] = useState({});

    const [uploadProfilePicture] = useMutation(ADD_PROFILE_PICTURE);

    const handleUpload = async () => {
        // only want this to run if updating 
        if (file) {
            // grab the base64 string from the file
            //  this was created and attached when previewing the file
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
                // reset state after a successful upload
                setFile({});
            } catch (error) {
                console.log(error);
            }
        }
        console.log(`upload`)
    };
    function createErrorMessage(msg) {
        setErrorMessage(msg);
        setTimeout(() => {
            setErrorMessage(false);
        }, 2500);
    };
    // callback to be invoked when dragging and dropping an item to be uploaded
    // or clicking on the text to upload
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/png, ,image/gif, image/jpg, image/jpeg',
        onDrop: async (acceptedFile) => {
            // check the size and type of acceptedFile
            // if file wasn't accepted length is zero
            if (acceptedFile.length > 0) {
                // grab the file
                const thisFile = acceptedFile[0];
                // destructure the size
                const { size } = thisFile;
                // if img is larger than 2mb
                if (size > 5 * 1024 * 1024) {
                    createErrorMessage('Files must be smaller than 5mb!');
                } else {
                    // convert to base64 string using FileReader in the
                    // browsers File API
                    const toBase = file => new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = error => reject(error);
                    })
                    try {
                        // try to convert file
                        const didConvert = await toBase(acceptedFile[0]);
                        // if successful set the file in state and create a preview data URL
                        // and attach the base64 to the state Object
                        setFile(
                            // convert preview string into a URL
                            Object.assign(acceptedFile[0], {
                                preview: URL.createObjectURL(acceptedFile[0]),
                                base64: didConvert
                            }),
                        );
                        // only want this to call the function if it exists and if the base64 was added to the preview
                        // this sets the profilePicture in the signUp form 
                        if (setProfile !== undefined) {
                            setProfile(didConvert);
                        }
                    } catch (error) {
                        // probably an error because the file isn't a supported type, although the supported types
                        // are declared on the input, any file can be dragged and dropped
                        const msg = error.message
                        // console.log(error.message);
                        if (msg === 'FileReader.readAsDataURL: Argument 1 is not an object.') {
                            // set the Message to alert the user and then clear it after 2.5 seconds
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

    // removes the objectURL from browsers memory,
    // this happens automatically on reload but best to clean it up when able
    useEffect(
        () => () => {
            URL.revokeObjectURL(file.preview);
            URL.revokeObjectURL(uploadedImage.preview);
        },
        [file, uploadedImage],
    );

    // preview component
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
            className='w-full h-80 flex flex-col justify-between p-3'
        >
            <span {...getRootProps()}
                className='w-full border-2 border-dashed border-green-400 p-1'
            >
                <input {...getInputProps()} />
                <label style={{ minWidth: '350px' }} className={`text-gray-300 self-center center bg-${errorMessage ? 'red-500' : 'bg-gray-700'}`} >{errorMessage ? `${errorMessage}` : `Drag 'n' drop a file here, or click to select file`}</label>
            </span>
            {AvatarPreview}
            {
                Object.keys(file).length > 0 &&
                <Button
                    color={{ color: 'green-700', hover: 'green-500' }}
                    radius={'rounded-md'}
                    class='text-white text-center p-2'
                    action={{ onClick: handleUpload }}
                >
                    Upload
                </Button>
            }
        </div >
    );
};