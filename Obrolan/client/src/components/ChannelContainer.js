import React from 'react';
import { Channel, MessageTeam } from 'stream-chat-react';

// importing components
import { CreateChannel, ChannelInner, EditChannel } from './';

const ChannelContainer = ({ isCreating, setIsCreating, isEditing, setIsEditing, createType }) => {
    // mengecek apakah user tersebut yang membuat channel atau user yang lain yang membuat channel
    if(isCreating) {
        return (
            <div className='channel__container'>
                <CreateChannel createType={createType} setIsCreating={setIsCreating} />
            </div>
        )
    }

    // mengecek apakah user tersebut yang mengedit channel atau user yang lain yang mengedit channel
    if(isEditing) {
        return (
            <div className='channel__container'>
                <EditChannel setIsEditing={setIsEditing} />
            </div>
        )
    }

    const EmptyState = () => (
        <div className='channel-empty__container'>
            <p className='channel-empty__first'>This Is The Begining Of Your Chat History</p>
            <p className='channel-empty__second'>Send Messages, Attachment, Links, Emojis And More! github pages: https://github.com/Anri85</p>
        </div>
    )

    return (
        <div className='channel__container'>
            <Channel
                EmptyStateIndicator={EmptyState}
                Message={(messageProps, index) => <MessageTeam key={index} { ...messageProps } /> }
            >
                <ChannelInner setIsEditing={setIsEditing} />
            </Channel>
        </div>
    );
};

export default ChannelContainer;