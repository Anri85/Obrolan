import React, { useState, useEffect } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

// importing icon
import { InviteIcon } from '../asset';

// helper function component
const ListContainer = ({ children }) => {
    return (
        <div className='user-list__container'>
            <div className='user-list__header'>
                <p>User</p>
                <p>Invite</p>
            </div>
            {children}
        </div>
    )
}

// helper function component
const UserItem = ({ user, setSelectedUsers }) => {
    const [selected, setSelected] = useState(false);

    const handleSelect = () => {
        if(selected) {
            setSelectedUsers((prevUsers) => prevUsers.filter((prevUser) => prevUser !== user.id));
        } else {
            setSelectedUsers((prevUsers) => [ ...prevUsers, user.id ]);
        }

        setSelected((prevSelected) => !prevSelected);
    }

    return (
        <div className='user-item__wrapper' onClick={handleSelect}>
            <div className='user-item__name-wrapper'>
                <Avatar image={user.image} name={user.fullname || user.id} size={32} />
                <p className='user-item__name'>{user.fullname || user.id}</p>
            </div>
            {selected ? <InviteIcon /> : <div className='user-item__invite-empty' />}
        </div>
    )
}

const UserList = ({ setSelectedUsers }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [listEmpty, setListEmpty] = useState(false)
    const [error, setError] = useState(false);
    const { client } = useChatContext();

    useEffect(() => {
        const getUsers = async () => {
            if(loading) {
                return;
            }
            setLoading(true);

            // query all users
            try {
                const response = await client.queryUsers(
                    { id: { $ne: client.userID } },
                    { id: 1 },
                    { limit: 8 }
                )

                if(response.users.length) {
                    setUsers(response.users);
                } else {
                    setListEmpty(true);
                }
            } catch (error) {
                setError(true);
            }

            setLoading(false);
        }

        // jika berhasil terkoneksi panggil fungsi getUsers
        if(client) {
            getUsers();
        }
    }, []);

    // mengecek apakah terjadi error
    if(error) {
        return (
            <ListContainer>
                <div className='user-list__container'>
                    Error Loading, Please Refresh And Try Again...
                </div>
            </ListContainer>
        )
    }

    // mengecek apakah users tidak ada
    if(listEmpty) {
        return (
            <ListContainer>
                <div className='user-list__container'>
                    No Users Found!
                </div>
            </ListContainer>
        )
    }

    return (
        <ListContainer>
            {loading ? <div className='user-list__message'>
                Loading Users...
            </div> : (
                users?.map((user, index) => (
                    <UserItem index={index} key={user.id} user={user} setSelectedUsers={setSelectedUsers} />
                ))
            )}
        </ListContainer>
    )
}

export default UserList;