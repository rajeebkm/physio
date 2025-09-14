import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Alert,
    Dimensions,
} from 'react-native';
import {
    RtcEngine,
    ChannelProfileType,
    ClientRole,
    RtcConnection,
    RtcStats,
} from 'react-native-agora';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

interface VideoCallScreenProps {
    route: {
        params: {
            sessionId: string;
            channelName: string;
            token: string;
            appId: string;
            role: 'patient' | 'provider';
        };
    };
    navigation: any;
}

export const VideoCallScreen: React.FC<VideoCallScreenProps> = ({
    route,
    navigation,
}) => {
    const { sessionId, channelName, token, appId, role } = route.params;
    const [isJoined, setIsJoined] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [remoteUid, setRemoteUid] = useState<number | null>(null);

    useEffect(() => {
        initializeAgora();
        return () => {
            RtcEngine.destroy();
        };
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isJoined) {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isJoined]);

    const initializeAgora = async () => {
        try {
            await RtcEngine.create(appId);
            await RtcEngine.enableVideo();
            await RtcEngine.enableAudio();
            await RtcEngine.setChannelProfile(ChannelProfileType.ChannelProfileCommunication);
            await RtcEngine.setClientRole(ClientRole.ClientRoleBroadcaster);

            // Set up event listeners
            RtcEngine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
                console.log('Join channel success', channel, uid, elapsed);
                setIsJoined(true);
            });

            RtcEngine.addListener('UserJoined', (uid, elapsed) => {
                console.log('User joined', uid, elapsed);
                setRemoteUid(uid);
            });

            RtcEngine.addListener('UserOffline', (uid, reason) => {
                console.log('User offline', uid, reason);
                setRemoteUid(null);
            });

            RtcEngine.addListener('LeaveChannel', (stats: RtcStats) => {
                console.log('Leave channel', stats);
                setIsJoined(false);
                navigation.goBack();
            });

            RtcEngine.addListener('Error', (err, msg) => {
                console.log('Agora error', err, msg);
                Alert.alert('Error', `Agora error: ${err} - ${msg}`);
            });

            // Join channel
            await RtcEngine.joinChannel(token, channelName, null, 0);
        } catch (error) {
            console.error('Initialize Agora failed:', error);
            Alert.alert('Error', 'Failed to initialize video call');
        }
    };

    const toggleMute = async () => {
        try {
            await RtcEngine.muteLocalAudioStream(!isMuted);
            setIsMuted(!isMuted);
        } catch (error) {
            console.error('Toggle mute failed:', error);
        }
    };

    const toggleVideo = async () => {
        try {
            await RtcEngine.muteLocalVideoStream(!isVideoEnabled);
            setIsVideoEnabled(!isVideoEnabled);
        } catch (error) {
            console.error('Toggle video failed:', error);
        }
    };

    const toggleSpeaker = async () => {
        try {
            await RtcEngine.setEnableSpeakerphone(!isSpeakerEnabled);
            setIsSpeakerEnabled(!isSpeakerEnabled);
        } catch (error) {
            console.error('Toggle speaker failed:', error);
        }
    };

    const endCall = async () => {
        try {
            await RtcEngine.leaveChannel();
        } catch (error) {
            console.error('End call failed:', error);
        }
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#1E3A8A', '#3B82F6']}
                style={styles.gradient}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.duration}>{formatDuration(callDuration)}</Text>
                    <Text style={styles.role}>
                        {role === 'patient' ? 'Patient' : 'Provider'}
                    </Text>
                </View>

                {/* Video Container */}
                <View style={styles.videoContainer}>
                    {isJoined ? (
                        <>
                            {/* Local Video */}
                            <View style={styles.localVideo}>
                                <RtcEngine.SurfaceView
                                    style={styles.video}
                                    canvas={{ uid: 0 }}
                                />
                                {!isVideoEnabled && (
                                    <View style={styles.videoPlaceholder}>
                                        <Icon name="videocam-off" size={50} color="#fff" />
                                        <Text style={styles.placeholderText}>Camera Off</Text>
                                    </View>
                                )}
                            </View>

                            {/* Remote Video */}
                            {remoteUid && (
                                <View style={styles.remoteVideo}>
                                    <RtcEngine.SurfaceView
                                        style={styles.video}
                                        canvas={{ uid: remoteUid }}
                                    />
                                </View>
                            )}

                            {/* Waiting for other participant */}
                            {!remoteUid && (
                                <View style={styles.waitingContainer}>
                                    <Icon name="person" size={80} color="#fff" />
                                    <Text style={styles.waitingText}>
                                        Waiting for {role === 'patient' ? 'provider' : 'patient'} to join...
                                    </Text>
                                </View>
                            )}
                        </>
                    ) : (
                        <View style={styles.connectingContainer}>
                            <Icon name="videocam" size={80} color="#fff" />
                            <Text style={styles.connectingText}>Connecting...</Text>
                        </View>
                    )}
                </View>

                {/* Controls */}
                <View style={styles.controls}>
                    <TouchableOpacity
                        style={[styles.controlButton, isMuted && styles.controlButtonActive]}
                        onPress={toggleMute}
                    >
                        <Icon
                            name={isMuted ? 'mic-off' : 'mic'}
                            size={24}
                            color={isMuted ? '#fff' : '#3B82F6'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.controlButton, !isVideoEnabled && styles.controlButtonActive]}
                        onPress={toggleVideo}
                    >
                        <Icon
                            name={isVideoEnabled ? 'videocam' : 'videocam-off'}
                            size={24}
                            color={isVideoEnabled ? '#3B82F6' : '#fff'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.controlButton, isSpeakerEnabled && styles.controlButtonActive]}
                        onPress={toggleSpeaker}
                    >
                        <Icon
                            name={isSpeakerEnabled ? 'volume-up' : 'volume-down'}
                            size={24}
                            color={isSpeakerEnabled ? '#fff' : '#3B82F6'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.controlButton, styles.endCallButton]}
                        onPress={endCall}
                    >
                        <Icon name="call-end" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    gradient: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    duration: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    role: {
        color: '#fff',
        fontSize: 14,
        opacity: 0.8,
    },
    videoContainer: {
        flex: 1,
        position: 'relative',
    },
    localVideo: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 120,
        height: 160,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#000',
    },
    remoteVideo: {
        flex: 1,
        backgroundColor: '#000',
    },
    video: {
        flex: 1,
    },
    videoPlaceholder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#374151',
    },
    placeholderText: {
        color: '#fff',
        fontSize: 12,
        marginTop: 8,
    },
    waitingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    waitingText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
    },
    connectingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    connectingText: {
        color: '#fff',
        fontSize: 18,
        marginTop: 20,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    controlButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    controlButtonActive: {
        backgroundColor: '#EF4444',
    },
    endCallButton: {
        backgroundColor: '#EF4444',
    },
});
