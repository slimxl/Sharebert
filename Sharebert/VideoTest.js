import React from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
} from 'react-native';
import { Video } from 'expo'

class PlaylistItem {
    constructor(name, uri, isVideo) {
        this.name = name;
        this.uri = uri;
        this.isVideo = isVideo;
    }
}

const PLAYLIST = [
    new PlaylistItem(
        '',
        'https://sharebert.com/media/test1.mp4',
        true
    ),
    new PlaylistItem(
        '',
        'https://sharebert.com/media/test2.mp4',
        true
    ),
    new PlaylistItem(
        '',
        'https://sharebert.com/media/test3.mp4',
        true
    ),
    new PlaylistItem(
        "",
        'https://sharebert.com/media/test4.mp4',
        true
    ),
    new PlaylistItem(
        '',
        'https://sharebert.com/media/test5.mp4',
        true
    ),
];
const LOOPING_TYPE_ALL = 0;
const LOOPING_TYPE_ONE = 1;

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const FONT_SIZE = 14;
const VIDEO_CONTAINER_HEIGHT = DEVICE_HEIGHT * 2.0 / 5.0 - FONT_SIZE * 2;

class VideoTest extends React.Component {
    constructor(props) {
        super(props);
        this.index = 0;
        this.playbackInstance = null;
        this.state = {
            loopingType: LOOPING_TYPE_ALL,
            muted: false,
            volume: 1.0,
            rate: 1.0,
            videoWidth: DEVICE_WIDTH,
            videoHeight: VIDEO_CONTAINER_HEIGHT,
            useNativeControls: true,
            fullscreen: false,
        };
    }

    async _loadNewPlaybackInstance(playing) {
        if (this.playbackInstance != null) {
            await this.playbackInstance.unloadAsync();
            this.playbackInstance.setOnPlaybackStatusUpdate(null);
            this.playbackInstance = null;
        }

        const source = { uri: PLAYLIST[this.index].uri };
        const initialStatus = {
            shouldPlay: playing,
            rate: this.state.rate,
            volume: this.state.volume,
            isMuted: this.state.muted,
            isLooping: this.state.loopingType === LOOPING_TYPE_ONE,
        };

        this._video.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate);
        await this._video.loadAsync(source, initialStatus);
        this.playbackInstance = this._video;

        this._updateScreenForLoading(false);
    }

    _mountVideo = component => {
        this._video = component;
        this._loadNewPlaybackInstance(true);
    };

    _updateScreenForLoading(isLoading) {
        if (isLoading) {
            this.setState({
                showVideo: false,
                isPlaying: false,
                isLoading: true,
            });
        } else {
            this.setState({
                playbackInstanceName: PLAYLIST[this.index].name,
                showVideo: PLAYLIST[this.index].isVideo,
                isLoading: false,
            });
        }
    }

    _onPlaybackStatusUpdate = status => {
        if (status.isLoaded) {
            this.setState({
                playbackInstancePosition: status.positionMillis,
                playbackInstanceDuration: status.durationMillis,
                shouldPlay: status.shouldPlay,
                isPlaying: status.isPlaying,
                isBuffering: status.isBuffering,
                rate: status.rate,
                muted: status.isMuted,
                volume: status.volume,
                loopingType: status.isLooping ? LOOPING_TYPE_ONE : LOOPING_TYPE_ALL,
                shouldCorrectPitch: status.shouldCorrectPitch,
            });
            if (status.didJustFinish && !status.isLooping) {
                this._advanceIndex(true);
                this._updatePlaybackInstanceForIndex(true);
            }
        } else {
            if (status.error) {
                console.log(`FATAL PLAYER ERROR: ${status.error}`);
                
            }
        }
    };


    _advanceIndex(forward) {
        this.index = (this.index + (forward ? 1 : PLAYLIST.length - 1)) % PLAYLIST.length;
    }

    async _updatePlaybackInstanceForIndex(playing) {
        this._updateScreenForLoading(true);

        this.setState({
            videoWidth: DEVICE_WIDTH,
            videoHeight: VIDEO_CONTAINER_HEIGHT,
        });

        this._loadNewPlaybackInstance(playing);
    }

    render() {
        return (
            <View style={styles.videoContainer}>
                <Video
                    ref={this._mountVideo}
                    style={[
                        styles.video,
                        {
                            opacity: 1.0,
                            width: this.state.videoWidth,
                            height: this.state.videoHeight,
                        },
                    ]}
                    resizeMode={Video.RESIZE_MODE_CONTAIN}
                    onPlaybackStatusUpdate={this._onPlaybackStatusUpdate}
                    useNativeControls={this.state.useNativeControls}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    videoContainer: {
        height: VIDEO_CONTAINER_HEIGHT,
    },
    video: {
        maxWidth: DEVICE_WIDTH,
    },
});
export default VideoTest;
