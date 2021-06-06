
const socket = io('/');

const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined,{
    path: '/peerjs',
    host: '/',
    port: '3000'
}); 

let myVideoStream;

navigator.mediaDevices.getUserMedia({
    video : true,
    audio : true
}).then(stream =>{
    myVideoStream = stream;
    addVideoStream(myVideo,stream);

    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video,userVideoStream);
        })
    })

    socket.on('user-connected', (userId) => {
        connectToNewUser(userId,stream);
    })

})

peer.on('open', (id)=>{
    socket.emit('join-room',ROOM_ID,id);
})



const connectToNewUser = (userId,stream) => {
    const call = peer.call(userId,stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video,userVideoStream);
    })
}

const addVideoStream = (video,stream) =>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videoGrid.append(video);
}

let text = $('input');

$('html').keydown((e) => {
    if(e.which == 13 && text.val.length !== 0){
        socket.emit('message',text.val());
        text.val('')
    }
})

socket.on('createMessage', message => {
    console.log(message);
    $('.messages').append(`<li class="message"><b>user</b><br>${message}</li>`);
    scrollToBottom();
})

const scrollToBottom = () => {
    var dis = $('.main_chat_window');
    dis.scrollTop(dis.prop("scrollHeight"));
}

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
   // console.log(enabled);
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }
    else{
        myVideoStream.getAudioTracks()[0].enabled = true;
        setMuteButton();
    }
}

const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main_mute_button').innerHTML = html;
  }
  
const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main_mute_button').innerHTML = html;
  }

const playStop = () => {
    
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      myVideoStream.getVideoTracks()[0].enabled = true;
      setStopVideo()
    }
}

const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main_video_button').innerHTML = html;
}
  
const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main_video_button').innerHTML = html;
}