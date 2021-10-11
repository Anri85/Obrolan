import React from 'react';
import { Avatar, useChatContext } from 'stream-chat-react'

const TeamChannelPreview = ({ channel, type, setToggleContainer, setIsCreating, setIsEditing, setActiveChannel }) => {
    const { channel: activeChannel, client } = useChatContext();

    // creating channel preview
    const ChannelPreview = () => (
        <p className='channel-preview__item'>
            # { channel?.data?.name || channel?.data?.id }
        </p>
    );

    // creating direct preview
    const DirectPreview = () => {
        const members = Object.values(channel?.state?.members).filter(({ user }) => user?.id !== client?.userID)

        return (
            <div className='channel-preview__item single'>
                <Avatar
                    image={members[0]?.user?.image}
                    name={members[0]?.user?.fullname}
                    size='24'
                />
                <p>{members[0]?.user?.fullname}</p>
            </div>
        )
    }

    return (
        <div className={ channel?.id === activeChannel?.id ? 'channel-preview__wrapper__selected' : 'channel-preview__wrapper' }
            onClick={() => {
                setIsCreating(false);
                setIsEditing(false);
                setActiveChannel(channel);
                
                if(setToggleContainer) {
                    setToggleContainer((prevToggleContainer) => !prevToggleContainer);
                }
            }}
        >
            { type === 'team' ? <ChannelPreview /> : <DirectPreview /> }
        </div>
    );
};

export default TeamChannelPreview;