import React, { useEffect, useRef } from "react";
import Peer from "simple-peer";

const VideoChat = ({ socket, partnerId, myStream }) => {
  const videoRef = useRef();
  const partnerVideoRef = useRef();

  useEffect(() => {
    if (!myStream) return;

    videoRef.current.srcObject = myStream;

    const peer = new Peer({ initiator: true, trickle: false, stream: myStream });
    peer.on("signal", (signal) => {
      socket.emit("signal", { to: partnerId, signal });
    });

    socket.on("signal", ({ from, signal }) => {
      if (from === partnerId) {
        peer.signal(signal);
      }
    });

    peer.on("stream", (partnerStream) => {
      partnerVideoRef.current.srcObject = partnerStream;
    });

    return () => {
      peer.destroy();
    };
  }, [myStream, partnerId, socket]);

  return (
    <div className="flex flex-col items-center mt-4">
      <h3 className="text-lg font-semibold">Chamada de Vídeo</h3>
      <div className="flex gap-4 mt-2">
        <video ref={videoRef} autoPlay playsInline className="rounded-lg border border-gray-500 w-1/2" />
        <video ref={partnerVideoRef} autoPlay playsInline className="rounded-lg border border-gray-500 w-1/2" />
      </div>
    </div>
  );
};

export default VideoChat;
