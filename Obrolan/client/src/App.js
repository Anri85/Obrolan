import React, { useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie';

// importing components
import { ChannelContainer, ChannelListContainer, Authentication } from './components';
// importing styles
import './App.css';
import 'stream-chat-react/dist/css/index.css';

// creating instance of cookies
const cookies = new Cookies();

const apiKey = '24wkxxpemqgy';

// getting token from cookies
const authToken = cookies.get('token');

const client = StreamChat.getInstance(apiKey);

// checking for token
if(authToken) {
    // creating user
    client.connectUser({
        id: cookies.get('userId'),
        name: cookies.get('username'),
        fullname: cookies.get('fullname'),
        phoneNumber: cookies.get('phoneNumber'),
        image: cookies.get('avatarURL'),
        hashPassword: cookies.get('hashPassword')
    }, authToken);
}

const App = () => {
    const [createType, setCreateType] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);


    if(!authToken) {
        return (
            <Authentication />
        );
    };

    return (
        <div className='app__wrapper'>
            <Chat client={client} theme='team light'>
                <ChannelListContainer
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    setCreateType={setCreateType}
                    setIsEditing={setIsEditing}
                />
                <ChannelContainer
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    createType={createType}
                />
            </Chat>
        </div>
    );
};

export default App;