import { useState,useEffect } from 'react'
import { Typography,Input,InputLabel,FormControl,Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal';

import InstagramEmbed from 'react-instagram-embed';

import './App.css';
import Post from './Post';
import { db,auth } from './Firebase'
import firebase from 'firebase'
import ImageUpload from './ImageUpload';


function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {

  const [posts, setPosts] = useState([])

  const [email, setEmail] = useState("")
  const [userName, setuserName] = useState("")
  const [password, setPassword] = useState("")
  const [openSignIn,setOpenSignIn] = useState(false)

  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const [open,setOpen] = useState(false)
  const [user, setUser] = useState(null)

  // run it once the page refreshes
  // onSnapshot fires every time a chng happen
  useEffect(() => {
    db.collection('posts').orderBy('timeStamp','desc').onSnapshot(snapshot =>(   
        setPosts(snapshot.docs.map( doc => ({
          id : doc.id,
          post : doc.data()
        })))
    ))
  }, [])
  

  useEffect(() => {
    // runs when anything related to user chnages
    const unsubscribe = auth.onAuthStateChanged((authUser) =>{
      if(authUser){
        //user has logged in...
        console.log(authUser)
        setUser(authUser)
      }
      else{
        //user has logged out
        setUser(null)
      }
    })
    return () =>{
      // perform some cleanup actions
      unsubscribe();
    }
  }, [user,userName])

  //For Sign Up
  const handleLogin = (event) =>{
    console.log("---->>>>",posts)
    event.preventDefault();

    // Creating and updating displayName
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser) =>{
      authUser.user.updateProfile({
        displayName: userName
      })
    })
    .catch(error => alert(error.message))

    setOpen(false)
  }


  //Sign In function
  const signIn = (event) =>{
    event.preventDefault()

    auth.signInWithEmailAndPassword(email,password)
    .catch(error => alert(error.message))

    setOpenSignIn(false)
  }


  console.log("User ------>>>>>>>>",user)
  if(user){
    console.log(1)
  }

  return (
    <div className="app">

      {/* Sign Up Modal */}
      <Modal open={open}
      onClose = {() => setOpen(false)}>

        <div style={modalStyle} className={classes.paper}>
          <h2>I am Modal</h2>
            <form className="app__signup">
            <center>
            <img style={{height:40}} className="app__headerImage" 
              src="http://4.bp.blogspot.com/-BjUAshY1TTs/UYNzmJIEq8I/AAAAAAAAZco/oggG2vRTlUg/s1600/Instragram+logo+2013.png" 
              alt=""/>
            </center>
            <Input 
                placeholder="text"
                type="text"
                value={userName}
                onChange={e => setuserName(e.target.value)}
                />

              <Input 
                placeholder="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                />

              <Input 
                placeholder="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                />  

                <Button type="submit" onClick={handleLogin}>Log In</Button>
            </form>
        </div>
      </Modal>

      {/* Sign In Modal */}
      <Modal open={openSignIn}
      onClose = {() => setOpenSignIn(false)}>

        <div style={modalStyle} className={classes.paper}>
          <h2>I am Modal</h2>
            <form className="app__signup">
            <center>
            <img style={{height:40}} className="app__headerImage" 
              src="http://4.bp.blogspot.com/-BjUAshY1TTs/UYNzmJIEq8I/AAAAAAAAZco/oggG2vRTlUg/s1600/Instragram+logo+2013.png" 
              alt=""/>
            </center>
              <Input 
                placeholder="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                />

              <Input 
                placeholder="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                />  

                <Button type="submit" onClick={signIn}>Log In</Button>
            </form>
        </div>
      </Modal>
      

      <div className="app__header">
        <img style={{height:40}} className="app__headerImage" 
        src="http://4.bp.blogspot.com/-BjUAshY1TTs/UYNzmJIEq8I/AAAAAAAAZco/oggG2vRTlUg/s1600/Instragram+logo+2013.png" />

        {user ? 
          (<Button onClick={() => auth.signOut()}>Log Out</Button>)
        : (
            <div className="app__loginContainer">
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>
          )}  
      </div>

      {/* Header
        Posts
      Posts*/}
  

      {/* id wont refresh old it'll add just new item if id is not present it'll refresh */}
      <div className="app__Posts">
        {posts.map(({id,post}) => (
          <Post key={id} postId={id} user={user} userName={post.userName} caption={post.caption} imageUrl={post.imageUrl} />
        ))}

      <InstagramEmbed
        url='https://instagr.am/p/Zw9o4/'
        clientAccessToken='123|456'
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
      />

      </div>

      {/* I want to have...
          Caption
          File Uploader
      Post Button */}
      {user?.displayName ?
      (<ImageUpload userName={user.displayName}/>) 
      : (<h3 style={{textAlign:'center'}}>Sorry! Please Login To Upload</h3>) }

    </div>
  );
}

export default App;
