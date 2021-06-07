import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import { db, storage } from './Firebase'
import firebase from 'firebase'
import './ImageUpload.css'

function ImageUpload({userName}) {

    const [caption,setCaption] = useState('')
    const [image,setImage] = useState('')
    const [progressBar,setProgresBar] = useState(0)

    const handleChange = (e) =>{
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    }

    const handleUpload = () =>{
        const uploadTask = storage.ref(`images/${image.name}`).put(image)

        uploadTask.on(
            'state_chnaged',
            (snapshot) =>{
                // Progress Bar Function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setProgresBar(progress)
            },
            // if an error happens
            (error) =>{
                // Error function...
                console.log(error.message)
                alert(error.message)
            },
            // when the upload completes
            () =>{
                // Complete function...
                storage
                    .ref('images')
                    .child(image.name)
                    .getDownloadURL()
                    .then(url =>{
                        // post image inside db
                        db.collection('posts').add({
                            timeStamp : firebase.firestore.FieldValue.serverTimestamp(),
                            caption : caption,
                            imageUrl : url,
                            userName : userName
                        })

                        setProgresBar(0)
                        setImage('')
                        setCaption('')
                    })

            }
        )
    }

    return (
        <div className="image__Upload">
            {/* I want to have...
                Caption
                File Uploader
                Post Button */}
            <progress className="progress_Bar" value={progressBar} max="100" />
            <input type="text" value={caption} placeholder="Enter a caption...." onChange={e => setCaption(e.target.value)} />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload} >Post</Button>
        </div>
    )
}

export default ImageUpload
