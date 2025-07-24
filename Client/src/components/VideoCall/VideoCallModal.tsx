"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/Button"
import { useAuth } from "@/context/AuthContext"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Video, X, Phone, PhoneOff } from "lucide-react"

interface VideoCallModalProps {
  isOpen: boolean
  onClose: () => void
  tutorId: number
  tutorName: string
  sessionId?: string
  isIncomingCall?: boolean
  existingSocket?: WebSocket | null
}

export function VideoCallModal({
  isOpen,
  onClose,
  tutorId,
  tutorName,
  sessionId,
  isIncomingCall = false,
  existingSocket = null
}: VideoCallModalProps) {
  const { user } = useAuth()
  const [status, setStatus] = useState<string>("Initializing...")
  const [callStatus, setCallStatus] = useState<string>("Idle")
  const [logs, setLogs] = useState<string[]>([])
  
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  
  const socketRef = useRef<WebSocket | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const isConnectedRef = useRef<boolean>(false)
  const isInCallRef = useRef<boolean>(false)

  // Add a log entry
  const addLog = (message: string) => {
    console.log(message)
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${message}`])
  }

  // Initialize WebRTC when the modal opens
  useEffect(() => {
    if (isOpen) {
      connectToSignalingServer()
    }
    
    return () => {
      cleanupConnection()
    }
  }, [isOpen])
  
  // Auto-start call if this is an incoming call for a tutor
  useEffect(() => {
    if (isOpen && isIncomingCall && status === "Ready to call") {
      startCall()
    }
  }, [isIncomingCall, status])

  // Connect to the signaling server
  const connectToSignalingServer = async () => {
    try {
      // Use existing socket if provided (for tutor side)
      if (existingSocket && existingSocket.readyState === WebSocket.OPEN) {
        addLog('Using existing WebSocket connection')
        socketRef.current = existingSocket
        isConnectedRef.current = true
        setStatus("Connected")
        
        // If this is an incoming call for a tutor, we need to join the provided session
        if (isIncomingCall && sessionId) {
          socketRef.current.send(JSON.stringify({
            type: 'join',
            userId: user?.id.toString(),
            sessionId: sessionId
          }))
        }
        
        // Get local media stream
        setupLocalStream()
        return
      }
      
      // Create session ID (can be more sophisticated in production)
      const callSessionId = sessionId || `session_${user?.id}_${tutorId}`
      
      // Connect to WebSocket
      const serverUrl = process.env.NEXT_PUBLIC_API_URL?.replace('http', 'ws') || 'ws://localhost:8080'
      const wsUrl = `${serverUrl}/ws/webrtc?userId=${user?.id}&sessionId=${callSessionId}`
      
      addLog(`Connecting to ${wsUrl}`)
      setStatus("Connecting to signaling server...")
      
      socketRef.current = new WebSocket(wsUrl)
      
      socketRef.current.onopen = () => {
        addLog('WebSocket connection established')
        setStatus("Connected")
        isConnectedRef.current = true
        
        // Join the session
        if (socketRef.current) {
          socketRef.current.send(JSON.stringify({
            type: 'join',
            userId: user?.id.toString(),
            sessionId: callSessionId
          }))
        }
        
        // Get local media stream
        setupLocalStream()
      }
      
      socketRef.current.onmessage = handleWebSocketMessage
      
      socketRef.current.onclose = () => {
        addLog('WebSocket connection closed')
        setStatus("Disconnected")
        cleanupConnection()
      }
      
      socketRef.current.onerror = (error) => {
        addLog(`WebSocket error: ${error}`)
        setStatus("Connection error")
      }
    } catch (error: any) {
      addLog(`Error: ${error.message}`)
      setStatus(`Error: ${error.message}`)
    }
  }
  
  // Set up local video stream
  const setupLocalStream = async () => {
    try {
      setStatus("Accessing camera and microphone...")
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      })
      
      localStreamRef.current = stream
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      
      addLog('Local media stream obtained')
      setStatus("Ready to call")
      
      // Log device information
      const videoTrack = stream.getVideoTracks()[0]
      const audioTrack = stream.getAudioTracks()[0]
      
      if (videoTrack) {
        addLog(`Video device: ${videoTrack.label}`)
      }
      
      if (audioTrack) {
        addLog(`Audio device: ${audioTrack.label}`)
      }
    } catch (error: any) {
      addLog(`Error accessing media devices: ${error.message}`)
      setStatus(`Media error: ${error.message}`)
    }
  }
  
  // Start a call
  const startCall = async () => {
    if (!isConnectedRef.current) {
      addLog('Error: Not connected to server')
      return
    }
    
    try {
      addLog(`Starting call with tutor ${tutorId}`)
      setCallStatus('Calling...')
      
      // Create peer connection
      createPeerConnection()
      
      // Add local tracks to peer connection
      if (localStreamRef.current && peerConnectionRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          if (peerConnectionRef.current && localStreamRef.current) {
            peerConnectionRef.current.addTrack(track, localStreamRef.current)
          }
        })
      }
      
      // Create and send offer
      if (peerConnectionRef.current) {
        const offer = await peerConnectionRef.current.createOffer()
        await peerConnectionRef.current.setLocalDescription(offer)
        
        if (socketRef.current) {
          socketRef.current.send(JSON.stringify({
            type: 'offer',
            to: tutorId.toString(),
            from: user?.id.toString(),
            sessionId: `session_${user?.id}_${tutorId}`,
            data: offer
          }))
        }
      }
      
      addLog('Offer sent')
      isInCallRef.current = true
      
    } catch (error: any) {
      addLog(`Error starting call: ${error.message}`)
      setCallStatus(`Error: ${error.message}`)
    }
  }
  
  // End the call
  const endCall = () => {
    if (isInCallRef.current) {
      addLog('Ending call')
      setCallStatus('Idle')
      
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
        peerConnectionRef.current = null
      }
      
      if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
        const stream = remoteVideoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
        remoteVideoRef.current.srcObject = null
      }
      
      isInCallRef.current = false
    }
  }
  
  // Clean up all connections
  const cleanupConnection = () => {
    if (isInCallRef.current) {
      endCall()
    }
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null
      }
      localStreamRef.current = null
    }
    
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close()
    }
    
    socketRef.current = null
    isConnectedRef.current = false
    setStatus("Disconnected")
  }
  
  // Create RTCPeerConnection
  const createPeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    }
    
    peerConnectionRef.current = new RTCPeerConnection(configuration)
    
    // Handle ICE candidate events
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.send(JSON.stringify({
          type: 'ice-candidate',
          to: tutorId.toString(),
          from: user?.id.toString(),
          sessionId: `session_${user?.id}_${tutorId}`,
          data: event.candidate
        }))
      }
    }
    
    // Handle connection state changes
    peerConnectionRef.current.onconnectionstatechange = () => {
      if (peerConnectionRef.current) {
        addLog(`Connection state: ${peerConnectionRef.current.connectionState}`)
        
        if (
          peerConnectionRef.current.connectionState === 'disconnected' ||
          peerConnectionRef.current.connectionState === 'failed' ||
          peerConnectionRef.current.connectionState === 'closed'
        ) {
          endCall()
        }
      }
    }
    
    // Handle incoming tracks
    peerConnectionRef.current.ontrack = (event) => {
      addLog('Received remote track')
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
      }
      setCallStatus('Connected')
    }
    
    addLog('Peer connection created')
  }
  
  // Handle WebSocket messages
  const handleWebSocketMessage = async (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data)
      addLog(`Received message: ${message.type}`)
      
      switch (message.type) {
        case 'offer':
          await handleOffer(message)
          break
        case 'answer':
          await handleAnswer(message)
          break
        case 'ice-candidate':
          await handleIceCandidate(message)
          break
        case 'user-joined':
          addLog(`User ${message.userId} joined the session`)
          break
        case 'user-left':
          addLog(`User ${message.userId} left the session`)
          if (message.userId === tutorId.toString() && isInCallRef.current) {
            addLog('Call ended because remote user left')
            endCall()
          }
          break
        case 'participants-list':
          addLog(`Participants in session: ${JSON.stringify(message.participants)}`)
          break
        case 'error':
          addLog(`Error from server: ${message.message}`)
          break
        default:
          addLog(`Unknown message type: ${message.type}`)
      }
    } catch (error: any) {
      addLog(`Error parsing message: ${error.message}`)
    }
  }
  
  // Handle incoming offer
  const handleOffer = async (message: any) => {
    if (message.from !== tutorId.toString()) {
      addLog(`Received offer from unexpected user: ${message.from}`)
      return
    }
    
    try {
      addLog(`Received offer from ${message.from}`)
      setCallStatus('Incoming call...')
      
      // Create peer connection if it doesn't exist
      if (!peerConnectionRef.current) {
        createPeerConnection()
        
        // Add local tracks to peer connection
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach(track => {
            if (peerConnectionRef.current && localStreamRef.current) {
              peerConnectionRef.current.addTrack(track, localStreamRef.current)
            }
          })
        }
      }
      
      // Set remote description
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(message.data))
        
        // Create and send answer
        const answer = await peerConnectionRef.current.createAnswer()
        await peerConnectionRef.current.setLocalDescription(answer)
        
        if (socketRef.current) {
          socketRef.current.send(JSON.stringify({
            type: 'answer',
            to: message.from,
            from: user?.id.toString(),
            sessionId: message.sessionId,
            data: answer
          }))
        }
      }
      
      addLog('Answer sent')
      isInCallRef.current = true
      setCallStatus('Connected')
      
    } catch (error: any) {
      addLog(`Error handling offer: ${error.message}`)
      setCallStatus(`Error: ${error.message}`)
    }
  }
  
  // Handle incoming answer
  const handleAnswer = async (message: any) => {
    if (message.from !== tutorId.toString()) {
      addLog(`Received answer from unexpected user: ${message.from}`)
      return
    }
    
    try {
      addLog(`Received answer from ${message.from}`)
      
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(message.data))
      }
      
      setCallStatus('Connected')
      addLog('Call established')
    } catch (error: any) {
      addLog(`Error handling answer: ${error.message}`)
      setCallStatus(`Error: ${error.message}`)
    }
  }
  
  // Handle incoming ICE candidate
  const handleIceCandidate = async (message: any) => {
    if (message.from !== tutorId.toString()) {
      addLog(`Received ICE candidate from unexpected user: ${message.from}`)
      return
    }
    
    try {
      if (message.data && peerConnectionRef.current) {
        addLog(`Received ICE candidate from ${message.from}`)
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(message.data))
      }
    } catch (error: any) {
      addLog(`Error handling ICE candidate: ${error.message}`)
    }
  }

  // Handle close modal
  const handleClose = () => {
    cleanupConnection()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => handleClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>Video Call with {tutorName}</div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="font-medium">Your Video</div>
            <div className="relative bg-slate-800 rounded-md overflow-hidden aspect-video">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-slate-900/70 text-white text-xs px-2 py-1 rounded">
                You
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="font-medium">Remote Video</div>
            <div className="relative bg-slate-800 rounded-md overflow-hidden aspect-video">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-slate-900/70 text-white text-xs px-2 py-1 rounded">
                {tutorName}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <div>Status: <span className="font-medium">{status}</span></div>
              <div>Call: <span className="font-medium">{callStatus}</span></div>
            </div>
            
            <div className="flex gap-2">
              {callStatus === 'Idle' ? (
                <Button 
                  onClick={startCall} 
                  disabled={status !== "Ready to call"}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Start Call
                </Button>
              ) : (
                <Button 
                  onClick={endCall} 
                  variant="destructive"
                  disabled={callStatus === 'Idle'}
                >
                  <PhoneOff className="h-4 w-4 mr-2" />
                  End Call
                </Button>
              )}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm font-medium">Logs</div>
            <div className="h-32 overflow-y-auto text-xs bg-slate-100 p-2 rounded border">
              {logs.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap">{log}</div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}