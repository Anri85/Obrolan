import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

// importing component
import { UserList } from './';
// importing icon
import { CloseCreateChannel } from '../asset';

// creating channel name input component
const ChannelNameInput = ({ channelName = '', setChannelName }) => {
    // handling input change
    const handleChange = (event) => {
        event.preventDefault();
        setChannelName(event.target.value)
    }

    return (
        <div className='channel-name-input__wrapper'>
            <p>Name</p>
            <input type="text" placeholder='With No Spaces' value={channelName} onChange={handleChange} />
            <p>Add Members</p>
        </div>
    )
}

const CreateChannel = ({ createType, setIsCreating }) => {
    const [channelName, setChannelName] = useState('');
    const { client, setActiveChannel } = useChatContext();
    const [selectedUsers, setSelectedUsers] = useState([client.userID || '']);

    // creating channel function
    const createChannel = async (event) => {
        event.preventDefault();

        try {
            const newChannel = await client.channel(createType, channelName, { name: channelName, members: selectedUsers });
            await newChannel.watch();

            setChannelName('');
            setIsCreating(false);
            setSelectedUsers([client.userID]);
            setActiveChannel(newChannel);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='create-channel__container'>
            <div className='create-channel__header'>
                <p>{createType === 'team' ? 'Create A New Channel' : 'Send A Direct Message'}</p>
                <CloseCreateChannel setIsCreating={setIsCreating} />
            </div>
            {createType === 'team' && <ChannelNameInput channelName={channelName} setChannelName={setChannelName} />}
            <UserList setSelectedUsers={setSelectedUsers} />
            <div className='create-channel__button-wrapper' onClick={createChannel}>
                <p>{createType === 'team' ? 'Create Channel' : 'Create Message Group'}</p>
            </div>
        </div>
    )
}

export default CreateChannel;