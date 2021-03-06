import React, { Fragment, useState } from 'react';
import Message from './Message';
import Progress from './Progress';

import api from '../../../../services/api';

const FileUpload = (user) => {
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Escolher foto');
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const onChange = e => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    };

    const onSubmit = async e => {
        e.preventDefault();
        const formData = new FormData()
        formData.append('photo', file)

        const config = {
            headers: {
                "content-type": "multipart/form-data"
            }
        }

        const res = await api.post('/users/upload/' + user.user.id, formData, {
            config, onUploadProgress: progressEvent => {
                setUploadPercentage(
                    parseInt(
                        Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    )
                );

                // Clear percentage
                setTimeout(() => setUploadPercentage(0), 10000);
            }
        })

        const { fileName, filePath } = res.data

        setUploadedFile({ fileName, filePath })

        setMessage('Foto Carregado');

        window.location.href = '/users/profile/' + user.user.id

    }

    return (
        <Fragment>
            {message ? <Message msg={message} /> : null}
            <form onSubmit={onSubmit}>
                <div className='custom-file mb-4'>
                    <input
                        type='file'
                        className='custom-file-input'
                        id='customFile'
                        onChange={onChange}
                    />
                    <label className='custom-file-label' htmlFor='customFile'>
                        {filename}
                    </label>
                </div>

                <Progress percentage={uploadPercentage} />

                <input
                    type='submit'
                    value='Upload'
                    className='btn btn-primary btn-block mt-4'
                />
            </form>
            {uploadedFile ? (
                <div className='row mt-5'>
                    <div className='col-md-6 m-auto'>
                        <h3 className='text-center'>{uploadedFile.fileName}</h3>
                        <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
                    </div>
                </div>
            ) : null}
        </Fragment>
    );
};

export default FileUpload;
