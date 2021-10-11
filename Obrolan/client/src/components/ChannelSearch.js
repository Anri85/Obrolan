import React, { useState, useEffect } from 'react';
import { useChatContext } from 'stream-chat-react';

// importing component
import { ResultDropDown } from './';
// importing icon
import { SearchIcon } from '../asset';
// main component
const ChannelSearch = ({ setToggleContainer }) => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [teamChannels, setTeamChannels] = useState([]);
    const [directChannels, setDirectChannels] = useState([]);
    const { client, setActiveChannel } = useChatContext();

    useEffect(() => {
        if(!query) {
            setTeamChannels([]);
            setDirectChannels([]);
        }
    }, [query]);

    // function get chat channel
    const getChannels = async (text) => {
        try {
            // fetch channels data from database
            const channelResponse = client.queryChannels({
                type: 'team',
                name: { $autocomplete: text },
                members: { $in: [client.userID] }
            });

            // fetch users data from database
            const userResponse = client.queryUsers({
                id: { $ne: client.userID },
                name: { $autocomplete: text }
            })

            const [channels, { users }] = await Promise.all([channelResponse, userResponse])

            if(channels.length) {
                setTeamChannels(channels);
            }
            if(users.length) {
                setDirectChannels(users);
            }
        } catch (error) {
            setQuery('');
        };
    }

    const onSearch = (event) => {
        event.preventDefault();

        setLoading(true);
        setQuery(event.target.value);

        // call function getChannels
        getChannels(event.target.value);
    }

    const setChannel = (channel) => {
        setQuery('');
        setActiveChannel(channel);
    }

    return (
        <div className='channel-search__container'>
            <div className='channel-search__input__wrapper'>
                <div className='channel-search__input__icon'>
                    <SearchIcon />
                </div>
                <input type="text" className='channel-search__input__text' placeholder='Search' value={query} onChange={onSearch} />
            </div>
            { query && (
                <ResultDropDown
                    teamChannels={teamChannels}
                    directChannels={directChannels}
                    loading={loading}
                    setChannel={setChannel}
                    setQuery={setQuery}
                    setToggleContainer={setToggleContainer}
                />
            ) }
        </div>
    );
};

export default ChannelSearch;