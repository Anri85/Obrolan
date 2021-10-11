import React, { useState } from 'react';
import { ChannelList, useChatContext } from 'stream-chat-react';
import Cookies from 'universal-cookie';

// importing components
import { ChannelSearch, TeamChannelList, TeamChannelPreview } from './';
// importing icon
// import HospitalIcon from '../asset/hospital.png';
import logo from '../asset/logo.jpg';
import LogoutIcon from '../asset/logout.png';

// creating instance of cookies
const cookies = new Cookies();

// creating sidebar
const Sidebar = ({ logout }) => (
    <div className='channel-list__sidebar'>
        <div className='channel-list__sidebar__icon1'>
            <div className='icon1__inner'>
                <img src={logo} alt="Hospital" width='30' />
            </div>
        </div>
        <div className='channel-list__sidebar__icon2'>
            <div className='icon1__inner' onClick={logout}>
                <img src={LogoutIcon} alt="Logout" width='30' />
            </div>
        </div>
    </div>
);

// creating company header
const CompanyHeader = () => (
    <div className='channel-list__header'>
        <p className='channel-list__header__text'>
            渋い Shibui
        </p>
    </div>
)

// creating channel team filter
const customChannelTeamFilter = (channels) => {
    return channels.filter((channel) => channel.type === 'team');
}

// creating channel messaging filter
const customChannelMessagingFilter = (channels) => {
    return channels.filter((channel) => channel.type === 'messaging');
}

// main component
const ChannelListContent = ({ isCreating, setIsCreating, setCreateType, setIsEditing, setToggleContainer }) => {
    const { client } = useChatContext();

    // logout function
    const logout = () => {
        cookies.remove('userId');
        cookies.remove('token');
        cookies.remove('username');
        cookies.remove('fullname');
        cookies.remove('phoneNumber');
        cookies.remove('avatarURL');
        cookies.remove('hashPassword');

        window.location.reload();
    }

    // creating filters
    const filters = { members: { $in: [client.userID] } };

    return (
        <>
            <Sidebar logout={logout} />
            <div className='channel-list__list__wrapper'>
                <CompanyHeader />
                <ChannelSearch setToggleContainer={setToggleContainer} />
                <ChannelList
                    filters={filters}
                    channelRenderFilterFn={customChannelTeamFilter}
                    List={(listProps) => (
                        <TeamChannelList
                            { ...listProps }
                            type='team'
                            isCreating={isCreating}
                            setIsCreating={setIsCreating}
                            setCreateType={setCreateType}
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                        />
                    )}
                    Preview={(previewProps) => (
                        <TeamChannelPreview
                            { ...previewProps }
                            type='team'
                            setToggleContainer={setToggleContainer}
                            setIsCreating={setIsCreating}
                            setIsEditing={setIsEditing}
                        />
                    )}
                />
                <ChannelList
                    filters={filters}
                    channelRenderFilterFn={customChannelMessagingFilter}
                    List={(listProps) => (
                        <TeamChannelList
                            { ...listProps }
                            type='messaging'
                            isCreating={isCreating}
                            setIsCreating={setIsCreating}
                            setCreateType={setCreateType}
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                        />
                    )}
                    Preview={(previewProps) => (
                        <TeamChannelPreview
                            { ...previewProps }
                            type='messaging'
                            setToggleContainer={setToggleContainer}
                            setIsCreating={setIsCreating}
                            setIsEditing={setIsEditing}
                        />
                    )}
                />
            </div>
        </>
    );
};

const ChannelListContainer = ({ setCreateType, setIsCreating, setIsEditing }) => {
    const [toggleContainer, setToggleContainer] = useState(false);

    return (
        <>
            <div className='channel-list__container'>
                <ChannelListContent
                    setIsCreating={setIsCreating}
                    setCreateType={setCreateType}
                    setIsEditing={setIsEditing}
                />
            </div>
            <div className='channel-list__container-responsive' style={{ left: toggleContainer ? '0%' : '-87%', backgroundColor: '#005fff' }}>
                <div className='channel-list__container-toggle' onClick={() => setToggleContainer((prevToggleContainer) => !prevToggleContainer)}>
                    
                </div>
                <ChannelListContent
                    setIsCreating={setIsCreating}
                    setCreateType={setCreateType}
                    setIsEditing={setIsEditing}
                    setToggleContainer={setToggleContainer}
                />
            </div>
        </>
    )
}

export default ChannelListContainer;