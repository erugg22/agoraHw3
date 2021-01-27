let handlefail = function (err) {
    console.log(err);
  };
  
  let remoteContainer = document.getElementById("remoteStream");
  let usersContainer = document.getElementById("usersList");

  function addVideoStream(streamId) {
    let streamdiv = document.createElement("div");
    streamdiv.id = streamId;
    streamdiv.style.transform = "rotateY(180deg)";
    streamdiv.style.width = "380px";
    streamdiv.style.height = "200px";
    streamdiv.style.borderRadius = "5px";
    streamdiv.style.border = "2px solid #099dfd";
    streamdiv.style.display = "inline-block";
    streamdiv.style.marginLeft = "40px";
    streamdiv.style.marginTop = "30px";
    remoteContainer.appendChild(streamdiv);
  }
  
  function addParticipant(participant) {
    let newParticipant = document.createElement("div");
    newParticipant.id = participant;
    newParticipant.innerHTML = participant;
    newParticipant.style.marginTop = "20px";
    usersContainer.appendChild(newParticipant);
  }

  function RemoveVideoStream(streamId) {
    let stream = evt.stream;
    stream.stop();
    let remDiv = document.getElementById(stream.getId());
    remDiv.parentNode.removeChild(remDiv);
  
    console.log("Remote stream is removed" + stream.getId());
  }
  
  document.getElementById("join").onclick = function () {
    let channelName = document.getElementById("ChannelName").value;
    let userName = document.getElementById("userName").value;
    let appId = "6a387038e94540499584c3d24fdd512b";
  
    let client = AgoraRTC.createClient({
      mode: "live",
      codec: "h264",
    });
    
    client.init(
      appId,
      () => console.log("AgoraRTC Client initialized"),
      handlefail
    );
  
    client.join(
      null,
      channelName,
      userName,
      () => {
        var localStream = AgoraRTC.createStream({
          video: true,
          audio: true,
        });
        localStream.init(function () {
          localStream.play("SelfStream");
          client.publish(localStream);
        });
        console.log(`App id: ${appId}\nChannel id: ${channelName}`);
        addParticipant(userName);
      },
      handlefail
    );
  
    client.on("stream-added", function (evt) {
      client.subscribe(evt.stream, handlefail);
    });
  
    client.on("stream-subscribed", function (evt) {
      console.log("I was called");
      let stream = evt.stream;
      addVideoStream(stream.getId());
      stream.play(stream.getId());
      addParticipant(stream.getId());
    });

    client.on("stream-removed", removeVideoStream);
    client.on("peer-leave", removeVideoStream);
  };