import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

// importing icon
import signInImage from '../asset/signup.jpg';

// creating instance of cookies
const cookies = new Cookies();

const Authentication = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [form, setForm] = useState({ fullname: '', username: '', phoneNumber: '', password: '', confirmPassword: '', avatarURL: '' });

    // handling input form
    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    // handling submit form to backend
    const handleSubmit = async (event) => {
        event.preventDefault();

        // passing data to backend
        const { username, password, phoneNumber, avatarURL } = form;
        const URL = 'https://shibui-chatapp.herokuapp.com/api/user';
        const { data: { token, userId, hashPassword, fullname } } = await axios.post(`${URL}/${isSignup ? 'register' : 'login'}`, {
            fullname: form.fullname, username, password, phoneNumber, avatarURL
        });

        // setting data from backend to cookies (login)
        cookies.set('token', token);
        cookies.set('username', username);
        cookies.set('fullname', fullname);
        cookies.set('userId', userId);

        // setting data from backend to cookies (register)
        if (isSignup) {
            cookies.set('phoneNumber', phoneNumber);
            cookies.set('avatarURL', avatarURL);
            cookies.set('hashPassword', hashPassword);
        }

        // reload the page
        window.location.reload();
    };

    // creating switch mode
    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
    };

    return (
        <div className='auth__form-container'>
            <div className='auth__form-container_fields'>
                <div className='auth__form-container_fields-content'>
                    <p>{isSignup ? 'Sign Up' : 'Sign In'}</p>
                    <form onSubmit={handleSubmit}>
                        {isSignup && (
                            <div className='auth__form-container_fields-content_input'>
                                <label htmlFor='Fullname'>Fullname</label>
                                <input type="text" name="fullname" placeholder='Fullname' onChange={handleChange} required />
                            </div>
                        )}
                        <div className='auth__form-container_fields-content_input'>
                            <label htmlFor='Username'>Username</label>
                            <input type="text" name="username" placeholder='Username' onChange={handleChange} required />
                        </div>
                        {isSignup && (
                            <div className='auth__form-container_fields-content_input'>
                                <label htmlFor='PhoneNumber'>Phone Number</label>
                                <input type="text" name="phoneNumber" placeholder='Phone Number' onChange={handleChange} required />
                            </div>
                        )}
                        {isSignup && (
                            <div className='auth__form-container_fields-content_input'>
                                <label htmlFor='AvatarURL'>Avatar URL</label>
                                <input type="text" name="avatarURL" placeholder='Avatar URL' onChange={handleChange} required />
                            </div>
                        )}
                        <div className='auth__form-container_fields-content_input'>
                            <label htmlFor='Password'>Password</label>
                            <input type="password" name="password" placeholder='Password' onChange={handleChange} required />
                        </div>
                        {isSignup && (
                            <div className='auth__form-container_fields-content_input'>
                                <label htmlFor='ConfirmPassword'>Confirm Password</label>
                                <input type="password" name="confirmPassword" placeholder='Confirm Password' onChange={handleChange} required />
                            </div>
                        )}
                        <div className='auth__form-container_fields-content_button'>
                            <button>{isSignup ? 'Sign Up' : 'Sign In'}</button>
                        </div>
                    </form>
                    <div className='auth__form-container_fields-account'>
                        <p>
                            {isSignup ? 'Already have an account?' : "Don't have an account?"}
                            <span onClick={switchMode}>{isSignup ? 'Sign In' : 'Sign Up'}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div className='auth__form-container_image'>
                <img src={signInImage} alt="Sign In" />
            </div>
        </div>
    );
};

export default Authentication;