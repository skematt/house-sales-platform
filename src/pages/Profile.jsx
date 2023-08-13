import React from 'react';
import {useState, useEffect} from "react";
import {getAuth, updateProfile} from 'firebase/auth';
import {updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc} from 'firebase/firestore';
import { db } from '../firebase.config';
import {useNavigate, Link} from "react-router-dom";
import {toast} from "react-toastify";
import arrowRightIcon from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";

function Profile(props) {
    const auth = getAuth();
    const [changeDetails, setChangeDetails] = useState(false);
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    })
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState(null);

    const {name, email} = formData;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserListings = async () => {
            const listingsRef = collection(db, 'listings');
            const q = query(listingsRef, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'));
            const querySnap = await getDocs(q);


            let listings = [];
            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })

            setListings(listings);
            setLoading(false);
        }
        fetchUserListings()
    }, [auth.currentUser.uid])

    const onLogout = () => {
        auth.signOut();
        navigate('/');
    }

    const onSubmit = async () => {
        try {
            // firebase authentication
            if (auth.currentUser.displayName !== name) {
                await updateProfile(auth.currentUser, {
                    displayName: name
                })
            }

            // firestore
            const userRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userRef, {
                name,
            })
        }
        catch(error) {
            toast.error('Something went wrong with updating your profile')
        }
    }

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    const onDelete = async (listingId) => {
        if (window.confirm('Are you sure you want to delete?')) {
            const docRef = doc(db, 'listings', listingId);
            await deleteDoc(docRef);
            const updatedListings = listings.filter((listing) => listing.id !== listingId);
            setListings(updatedListings);
            toast.success('Successfully deleted listing')
        }
    }

    const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)


    return (<div className={"profile"}>
        <header className="profileHeader">
            <p className="pageHeader">My Profile</p>
            <button type='button' className="logOut" onClick={onLogout}>
                Logout
            </button>
        </header>

        <main>
            <div className="profileDetailsHeader">
                <p className="profileDetailsText">Personal Details</p>
                <p
                    className="changePersonalDetails"
                    onClick={() => {
                        changeDetails && onSubmit();
                        setChangeDetails((prevState) => !prevState);
                    }}>
                    {changeDetails ? 'Done' : 'Change'}
                </p>
            </div>

            <div className="profileCard">
                <form>
                    <input type="text"
                           id={'name'}
                           className={!changeDetails ? 'profileName' : 'profileNameActive'}
                           disabled={!changeDetails}
                           value={name}
                           onChange={onChange}
                    />
                    <input type="text"
                           id={'email'}
                           className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
                           disabled={!changeDetails}
                           value={email}
                           onChange={onChange}
                    />
                </form>
            </div>

            <Link to={'/create-listing'} className="createListing">
                <img src={homeIcon} alt="home" />
                <p>Sell or rent your home</p>
                <img src={arrowRightIcon} alt="arrow right" />
            </Link>

            {loading && (<Spinner />)}

            {!loading && listings?.length > 0 && (
                <>
                    <p className="listingTest">Your Listings</p>
                    <ul className="listingsList">
                        {listings.map((listing) => (
                            <ListingItem
                                key={listing.id}
                                listing={listing.data}
                                id={listing.id}
                                onDelete={() => onDelete(listing.id)}
                                onEdit={() => onEdit(listing.id)}
                            >

                            </ListingItem>
                        ))}
                    </ul>
                </>
            )}
        </main>
    </div>)
}

export default Profile;