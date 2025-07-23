// WebRTC Configuration and Utilities
export interface WebRTCConfig {
    iceServers: RTCIceServer[]
    iceCandidatePoolSize?: number
    iceTransportPolicy?: RTCIceTransportPolicy
    bundlePolicy?: RTCBundlePolicy
    rtcpMuxPolicy?: RTCRtcpMuxPolicy
    sdpSemantics?: 'unified-plan' | 'plan-b'
}

export const webrtcConfig: WebRTCConfig = {
    iceServers: [
        // STUN servers
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
        { urls: 'stun:stun.stunprotocol.org:3478' },
        { urls: 'stun:stun.voiparound.com' },
        { urls: 'stun:stun.voipbuster.com' },
        
        // Free TURN servers (limited capacity but good for testing)
        { 
            urls: 'turn:openrelay.metered.ca:80',
            username: 'openrelayproject',
            credential: 'openrelayproject'
        },
        { 
            urls: 'turn:openrelay.metered.ca:443',
            username: 'openrelayproject',
            credential: 'openrelayproject'
        },
        { 
            urls: 'turn:openrelay.metered.ca:443?transport=tcp',
            username: 'openrelayproject',
            credential: 'openrelayproject'
        },
        // Additional free TURN servers
        {
            urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
            username: 'webrtc',
            credential: 'webrtc'
        }
    ],
    iceCandidatePoolSize: 10,
    iceTransportPolicy: 'all',
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require',
    sdpSemantics: 'unified-plan'
}

export class WebRTCManager {
    private peerConnection: RTCPeerConnection | null = null
    private localStream: MediaStream | null = null
    private remoteStream: MediaStream | null = null
    private dataChannel: RTCDataChannel | null = null
    private onRemoteStreamCallback?: (stream: MediaStream) => void
    private onDataChannelMessageCallback?: (message: string) => void
    private onConnectionStateChangeCallback?: (state: RTCPeerConnectionState) => void
    private pendingIceCandidates: RTCIceCandidateInit[] = []
    private remoteDescriptionSet: boolean = false
    private connectionTimeout: any = null

    constructor() {
        this.initializePeerConnection()
    }

    private initializePeerConnection() {
        console.log('🔧 Initializing WebRTC peer connection with config:', webrtcConfig)
        this.peerConnection = new RTCPeerConnection(webrtcConfig)

        // Handle remote stream
        this.peerConnection.ontrack = (event) => {
            console.log('🎥 Received remote stream track:', event.track.kind)
            this.remoteStream = event.streams[0]
            if (this.onRemoteStreamCallback) {
                this.onRemoteStreamCallback(this.remoteStream)
            }
        }

        // Handle ICE candidates
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('🧊 New ICE candidate generated:', {
                    candidate: event.candidate.candidate.substring(0, 50) + '...',
                    sdpMLineIndex: event.candidate.sdpMLineIndex,
                    sdpMid: event.candidate.sdpMid,
                    usernameFragment: event.candidate.usernameFragment
                })
                
                if (this.onIceCandidateCallback) {
                    console.log('🧊 Calling ICE candidate callback to send via WebSocket')
                    this.onIceCandidateCallback(event.candidate)
                } else {
                    console.error('🧊 No ICE candidate callback registered!')
                }
            } else {
                console.log('🧊 ICE candidate gathering completed (null candidate)')
            }
        }

        // Handle connection state changes
        this.peerConnection.onconnectionstatechange = () => {
            const state = this.peerConnection?.connectionState
            console.log('🔗 Connection state changed:', state)
            
            if (this.onConnectionStateChangeCallback && state) {
                this.onConnectionStateChangeCallback(state)
            }

            if (state === 'connected') {
                console.log('🎉 WebRTC connection established!')
                // Clear connection timeout if it exists
                if (this.connectionTimeout) {
                    clearTimeout(this.connectionTimeout)
                    this.connectionTimeout = null
                }
            } else if (state === 'failed' || state === 'disconnected') {
                console.error('🔗 WebRTC connection failed or disconnected:', state)
            }
        }

        // Handle ICE connection state changes for additional debugging
        this.peerConnection.oniceconnectionstatechange = () => {
            const iceState = this.peerConnection?.iceConnectionState
            console.log('🧊 ICE connection state changed:', iceState)

            if (iceState === 'failed') {
                console.error('🧊 ICE connection failed - this usually means NAT/firewall issues')
                console.error('🧊 Consider adding TURN servers for production use')
                
                // Try to restart ICE
                this.restartIce()
            } else if (iceState === 'connected' || iceState === 'completed') {
                console.log('🧊 ICE connection established successfully!')
            }
        }

        // Handle ICE gathering state changes
        this.peerConnection.onicegatheringstatechange = () => {
            const gatheringState = this.peerConnection?.iceGatheringState
            console.log('🧊 ICE gathering state changed:', gatheringState)
        }

        // Handle data channel
        this.peerConnection.ondatachannel = (event) => {
            console.log('📡 Data channel received:', event.channel.label)
            const channel = event.channel
            channel.onmessage = (event) => {
                console.log('📡 Data channel message received:', event.data)
                if (this.onDataChannelMessageCallback) {
                    this.onDataChannelMessageCallback(event.data)
                }
            }
        }
        
        // Set a connection timeout with a longer duration
        this.connectionTimeout = setTimeout(() => {
            if (this.peerConnection?.connectionState !== 'connected') {
                console.log('🔗 WebRTC connection taking longer than expected - continuing to wait')
                
                // Set a second timeout for actual restart
                setTimeout(() => {
                    if (this.peerConnection?.connectionState !== 'connected') {
                        console.log('🔗 WebRTC connection still not established - attempting to restart ICE')
                        this.restartIce()
                    }
                }, 15000) // Additional 15 seconds
            }
        }, 30000) // 30 seconds timeout
    }
    
    // Restart ICE if connection fails
    private async restartIce() {
        console.log('🧊 Attempting to restart ICE connection...')
        
        if (!this.peerConnection) {
            console.error('🧊 Cannot restart ICE - peer connection not initialized')
            return
        }
        
        try {
            // Create a new offer with ICE restart
            const offer = await this.peerConnection.createOffer({ iceRestart: true })
            await this.peerConnection.setLocalDescription(offer)
            console.log('🧊 ICE restart initiated with new offer')
            
            // Return the offer so it can be sent to the remote peer
            return offer
        } catch (error) {
            console.error('🧊 Error restarting ICE:', error)
        }
    }

    async getUserMedia(constraints: MediaStreamConstraints = { video: true, audio: true }): Promise<MediaStream> {
        try {
            // If we already have a local stream, return it
            if (this.localStream && this.localStream.active) {
                console.log('🎥 Reusing existing local stream')
                return this.localStream
            }

            console.log('🎥 Requesting user media with constraints:', constraints)
            this.localStream = await navigator.mediaDevices.getUserMedia(constraints)

            // Add tracks to peer connection
            if (this.peerConnection) {
                this.localStream.getTracks().forEach(track => {
                    console.log('🎥 Adding track to peer connection:', track.kind)
                    this.peerConnection!.addTrack(track, this.localStream!)
                })
            }

            console.log('🎥 User media obtained successfully')
            return this.localStream
        } catch (error) {
            console.error('🎥 Error accessing media devices:', error)
            
            if (error instanceof Error) {
                if (error.name === 'NotReadableError') {
                    console.error('🎥 Camera/microphone is in use by another application')
                    console.error('🎥 Please close other applications using camera/microphone and try again')
                    
                    // Try with audio only as fallback
                    console.log('🎥 Trying with audio only as fallback...')
                    return this.getUserMedia({ audio: true, video: false })
                } else if (error.name === 'NotAllowedError') {
                    console.error('🎥 Camera/microphone access denied by user')
                } else if (error.name === 'NotFoundError') {
                    console.error('🎥 No camera/microphone found')
                    
                    // Try with audio only as fallback
                    console.log('🎥 Trying with audio only as fallback...')
                    return this.getUserMedia({ audio: true, video: false })
                }
            }
            
            throw error
        }
    }

    async getDisplayMedia(): Promise<MediaStream> {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            })

            // Replace video track with screen share
            if (this.peerConnection && this.localStream) {
                const videoTrack = screenStream.getVideoTracks()[0]
                const sender = this.peerConnection.getSenders().find(s =>
                    s.track && s.track.kind === 'video'
                )

                if (sender) {
                    await sender.replaceTrack(videoTrack)
                }

                // Handle screen share end
                videoTrack.onended = () => {
                    this.stopScreenShare()
                }
            }

            return screenStream
        } catch (error) {
            console.error('Error accessing screen share:', error)
            throw error
        }
    }

    async stopScreenShare() {
        if (this.localStream && this.peerConnection) {
            const videoTrack = this.localStream.getVideoTracks()[0]
            const sender = this.peerConnection.getSenders().find(s =>
                s.track && s.track.kind === 'video'
            )

            if (sender && videoTrack) {
                await sender.replaceTrack(videoTrack)
            }
        }
    }

    async createOffer(): Promise<RTCSessionDescriptionInit> {
        if (!this.peerConnection) {
            throw new Error('Peer connection not initialized')
        }

        // Create data channel for chat
        this.dataChannel = this.peerConnection.createDataChannel('chat')
        console.log('📡 Created data channel:', this.dataChannel.label)
        
        this.dataChannel.onopen = () => {
            console.log('📡 Data channel opened')
        }
        
        this.dataChannel.onclose = () => {
            console.log('📡 Data channel closed')
        }
        
        this.dataChannel.onerror = (error) => {
            console.error('📡 Data channel error:', error)
        }
        
        this.dataChannel.onmessage = (event) => {
            console.log('📡 Data channel message received:', event.data)
            if (this.onDataChannelMessageCallback) {
                this.onDataChannelMessageCallback(event.data)
            }
        }

        console.log('📡 Creating offer...')
        const offer = await this.peerConnection.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
        })
        
        console.log('📡 Setting local description (offer)...')
        await this.peerConnection.setLocalDescription(offer)
        console.log('📡 Local description set successfully')

        return offer
    }

    async createAnswer(): Promise<RTCSessionDescriptionInit> {
        if (!this.peerConnection) {
            throw new Error('Peer connection not initialized')
        }

        console.log('📡 Creating answer...')
        const answer = await this.peerConnection.createAnswer()
        
        console.log('📡 Setting local description (answer)...')
        await this.peerConnection.setLocalDescription(answer)
        console.log('📡 Local description set successfully')

        return answer
    }

    async setRemoteDescription(description: RTCSessionDescriptionInit) {
        if (!this.peerConnection) {
            throw new Error('Peer connection not initialized')
        }

        console.log('🎯 Setting remote description:', description.type)
        await this.peerConnection.setRemoteDescription(description)
        this.remoteDescriptionSet = true
        console.log('🎯 Remote description set successfully')

        // Process any pending ICE candidates
        console.log('🧊 Processing', this.pendingIceCandidates.length, 'pending ICE candidates')
        for (const candidate of this.pendingIceCandidates) {
            try {
                await this.peerConnection.addIceCandidate(candidate)
                console.log('🧊 Added pending ICE candidate')
            } catch (error) {
                console.error('🧊 Error adding pending ICE candidate:', error)
            }
        }
        this.pendingIceCandidates = []
    }

    async addIceCandidate(candidate: RTCIceCandidateInit) {
        if (!this.peerConnection) {
            console.error('🧊 Cannot add ICE candidate - peer connection not initialized')
            return // Don't throw error, just return to prevent connection failures
        }

        // Validate candidate before processing
        if (!candidate || !candidate.candidate) {
            console.log('🧊 Empty ICE candidate received, ignoring')
            return
        }

        console.log('🧊 Processing ICE candidate:', candidate.candidate.substring(0, 50) + '...')
        console.log('🧊 Remote description set:', this.remoteDescriptionSet)
        console.log('🧊 Connection state:', this.peerConnection.connectionState)
        console.log('🧊 ICE connection state:', this.peerConnection.iceConnectionState)
        console.log('🧊 ICE gathering state:', this.peerConnection.iceGatheringState)

        // If remote description is not set yet, buffer the candidate
        if (!this.remoteDescriptionSet) {
            console.log('🧊 Buffering ICE candidate (remote description not set yet):', 
                candidate.candidate.substring(0, 50) + '...')
            this.pendingIceCandidates.push(candidate)
            console.log('🧊 Total buffered candidates:', this.pendingIceCandidates.length)
            return
        }

        try {
            console.log('🧊 Adding ICE candidate immediately:', 
                candidate.candidate.substring(0, 50) + '...')
            
            // Add a retry mechanism for adding ICE candidates
            const maxRetries = 3;
            let retryCount = 0;
            
            const addCandidate = async (): Promise<void> => {
                try {
                    await this.peerConnection!.addIceCandidate(new RTCIceCandidate(candidate));
                    console.log('🧊 ICE candidate added successfully');
                } catch (error) {
                    if (retryCount < maxRetries) {
                        retryCount++;
                        console.log(`🧊 Retrying ICE candidate addition (${retryCount}/${maxRetries})...`);
                        // Wait a bit before retrying
                        await new Promise(resolve => setTimeout(resolve, 500));
                        return addCandidate();
                    } else {
                        console.error('🧊 Failed to add ICE candidate after retries:', error);
                        console.error('🧊 Problem candidate:', candidate);
                        
                        // If still failing after retries, buffer the candidate for later
                        this.pendingIceCandidates.push(candidate);
                        console.log('🧊 Buffered failed candidate for later retry');
                    }
                }
            };
            
            await addCandidate();
        } catch (error) {
            console.error('🧊 Error adding ICE candidate:', error)
            console.error('🧊 Problem candidate:', candidate)
            
            // Buffer the candidate for later retry
            this.pendingIceCandidates.push(candidate);
            console.log('🧊 Buffered failed candidate for later retry');
        }
    }

    sendDataChannelMessage(message: string) {
        if (this.dataChannel && this.dataChannel.readyState === 'open') {
            console.log('📡 Sending data channel message:', message)
            this.dataChannel.send(message)
        } else {
            console.error('📡 Cannot send message - data channel not open')
            console.log('📡 Data channel state:', this.dataChannel?.readyState)
        }
    }

    // Callback setters
    onRemoteStream(callback: (stream: MediaStream) => void) {
        this.onRemoteStreamCallback = callback
    }

    onDataChannelMessage(callback: (message: string) => void) {
        this.onDataChannelMessageCallback = callback
    }

    onConnectionStateChange(callback: (state: RTCPeerConnectionState) => void) {
        this.onConnectionStateChangeCallback = callback
    }

    private onIceCandidateCallback?: (candidate: RTCIceCandidateInit) => void

    // ICE candidate callback setter
    onIceCandidate(callback: (candidate: RTCIceCandidateInit) => void) {
        this.onIceCandidateCallback = callback
    }

    // Cleanup
    cleanup() {
        console.log('🧹 Cleaning up WebRTC resources...')
        
        if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout)
            this.connectionTimeout = null
        }
        
        if (this.localStream) {
            console.log('🧹 Stopping local media tracks...')
            this.localStream.getTracks().forEach(track => {
                console.log('🧹 Stopping track:', track.kind)
                track.stop()
            })
        }
        
        if (this.peerConnection) {
            console.log('🧹 Closing peer connection...')
            this.peerConnection.close()
        }

        this.localStream = null
        this.remoteStream = null
        this.peerConnection = null
        this.dataChannel = null
        this.remoteDescriptionSet = false
        this.pendingIceCandidates = []
        
        console.log('🧹 WebRTC cleanup complete')
    }

    // Getters
    getLocalStream(): MediaStream | null {
        return this.localStream
    }

    getRemoteStream(): MediaStream | null {
        return this.remoteStream
    }

    getConnectionState(): RTCPeerConnectionState | null {
        return this.peerConnection?.connectionState || null
    }
}