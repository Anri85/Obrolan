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

const EditChannel = ({ setIsEditing }) => {
    const { channel } = useChatContext();
    const [channelName, setChannelName] = useState(channel?.data?.name);
    const [selectedUsers, setSelectedUsers] = useState([]);

    // updating channel changes function
    const updateChannel = async (event) => {
        event.preventDefault();

        const nameChanged = channelName !== (channel.data.name || channel.data.id);

        // jika nama berubah
        if(nameChanged) {
            await channel.update({ name: channelName }, { text: `Channel Name Changed To ${channelName}` });
        }

        // jika jumlah anggota berubah
        if(selectedUsers.length) {
            await channel.addMembers(selectedUsers);
        }

        setChannelName(null);
        setIsEditing(false);
        setSelectedUsers([]);
    }

    return (
        <div className='edit-channel__container'>
            <div className='edit-channel__header'>
                <p>Edit Channel</p>
                <CloseCreateChannel setIsEditing={setIsEditing} />
            </div>
            <ChannelNameInput channelName={channelName} setChannelName={setChannelName} />
            <UserList setSelectedUsers={setSelectedUsers} />
            <div className='edit-channel__button-wrapper' onClick={updateChannel}>
                <p>Save Changes</p>
            </div>
        </div>
    )
}

export default EditChannel;