import React, { Component, createRef } from 'react';
import * as CONSTANTS from '../constants';
import axios from 'axios';
import { v4 as uuid } from 'uuid';


class Video extends Component {
    constructor(props) {
        super(props);

        this.localVideoRef = createRef();

        this.state = {
            roomID: ''
        };
    }

    getMediaDevices = (roomID) => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {

                this.localVideoRef.current.srcObject = stream;

                console.log(stream)

                this.props.socket.emit('join-room', { roomID: 1, userID: uuid(), stream });
                this.props.socket.on('user-connected', (userInfo) => {
                    console.log(userInfo);
                })

            }).catch((error) => {
                if (error.name === CONSTANTS.PERMISSION_DENIED_ERROR) {
                    alert('Please give the permission to start video chat');
                    return;
                }

                alert('Video can not be connected');
                console.log(error);
            });
    }

    getRoomID = async () => {
        try {
            const response = await axios.get(CONSTANTS.BACKEND_URL);
            return response.data.roomID;
        } catch (error) {
            console.log(error);
            throw error;
        };
    }

    componentDidMount() {
        this.getRoomID()
            .then((roomID) => {
                this.getMediaDevices(roomID);
            }).catch((error) => {
                console.log(error);
            })
    };

    render() {
        return (
            <video
                style={{ width: 240, height: 240, margin: 5, backgroundColor: 'black' }}
                autoPlay
                muted
                ref={this.localVideoRef}
            />
        );
    }
}

export default Video;