import React from 'react';
import {useState} from 'react';
import {toast} from "react-toastify";
import {Link, useNavigate} from 'react-router-dom';
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import { db } from '../firebase.config';
import {setDoc, doc, serverTimestamp} from 'firebase/firestore';
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg';
import VisibilityIcon from '../assets/svg/visibilityIcon.svg';
import OAuth from "../components/OAuth";


function SignIn(props) {

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const {name, email, password} = formData;

    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            updateProfile(auth.currentUser, {
                displayName: name
            });

            const formDataCopy = {...formData};
            delete formDataCopy.password;
            formDataCopy.timestamp = serverTimestamp();

            await setDoc(doc(db, 'users', user.uid), formDataCopy);

            navigate('/');
        } catch (error) {
            toast.error('Something went wrong with registration')
        }
    }

    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">
                        Welcome!
                    </p>
                </header>

                <form onSubmit={onSubmit}>
                    <input type="text"
                           className="nameInput"
                           placeholder="Name"
                           id="name"
                           value={name}
                           onChange={onChange}
                    />

                    <input type="email"
                           className="emailInput"
                           placeholder="Email"
                           id="email"
                           value={email}
                           onChange={onChange}
                    />

                    <div className="passwordInputDiv">
                        <input type={showPassword ? "text" : "password"}
                               className="passwordInput"
                               placeholder="Password"
                               id="password"
                               value={password}
                               onChange={onChange}
                        />

                        <img
                            src={VisibilityIcon}
                            alt="show password"
                            className="showPassword"
                            fill={"#3c3c3c"}
                            onClick={() => setShowPassword((prevState) => !prevState)}/>
                    </div>

                    <Link to='/forgot-password' className="forgotPasswordLink">
                        Forgot password?
                    </Link>

                    <div className="signUpBar">
                        <p className="signUpText">Sign Up</p>
                        <button className="signUpButton">
                            <ArrowRightIcon fill="#ffffff" width="34px" height="34px"/>
                        </button>
                    </div>
                </form>

                <OAuth />

                <Link className="registerLink" to="/sign-in">
                    Sign In Instead
                </Link>
            </div>
        </>
    );
}

export default SignIn;