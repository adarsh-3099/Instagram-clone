import React, { useEffect, useState } from 'react'
import './Post.css'
import {Avatar} from '@material-ui/core'
import { db } from './Firebase'
import firebase from 'firebase'

function Post({user,postId,userName,imageUrl,caption}) {

    const [comments,setComments] = useState([])
    const[comment,setComment] = useState('')

    useEffect(() =>{
        let unsubscribe;
        if(postId){
             unsubscribe = db.collection('posts').doc(postId).collection('comments').orderBy('timestamp','asc').onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()))
                console.log(1)
            })
            }
        return () =>{
            unsubscribe();
        }
    }
    ,[postId])


    const postComment = (event) =>{
        event.preventDefault()
        
        db.collection('posts').doc(postId).collection('comments').add({
            text : comment,
            userName : user.displayName,
            timeStamp : firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
    }

    return (
        <div className="post">
            {/* header ->  Avatar + username */ }
            <div className="post__header">
                <Avatar className="post__avatar"
                    alt="Jeeny"
                    src={imageUrl} />
                <h3>{userName}</h3>
            </div>
            {/* Image */ }

            <img className="post__image" src={imageUrl} />

            {/* username + caption*/ }

            <h4 className="post__text"><strong>{userName} :</strong>{caption}</h4>

            <div className="post__Comments">
                {comments.map(comment =>(
                    <p>
                        <b><strong>{comment.userName}</strong> {comment.text}</b>
                    </p>
                ))}
            </div>

            {user && (
                <form className="post__commentBox">
                <input className="post__input"
                        type="text"
                        placeholder="Enter a comment..."
                        value={comment}
                        onChange={e => setComment(e.target.value)} />
                <button className="post__button" onClick={postComment}>post</button>
            </form>

            )}
            
        </div>
    )
}

export default Post
