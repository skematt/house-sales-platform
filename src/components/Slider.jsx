import React from 'react';
import {useState, useEffect} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {collection, getDocs, query, orderBy, limit} from "firebase/firestore";
import {db} from "../firebase.config";
import { Swiper, SwiperSlide } from 'swiper/react';
import {Navigation, Pagination, Scrollbar, A11y} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Spinner from "./Spinner";


function Slider(props) {

    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        const fetchListings = async () => {
            const listingsRef = collection(db, 'listings');
            const q = query(listingsRef,orderBy('timestamp', 'desc'), limit(5))
            const querySnap = await getDocs(q);

            let listings = []
            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            setListings(listings)
            setLoading(false)
        }

        fetchListings()

    }, [])

    if (loading) {
        return <Spinner/>
    }
    return listings && (
        <>
            <p className="exploreHeading">
                Recommended
            </p>


            <Swiper
                slidesPerView={1}
                pagination={{clickable: true}}
                modules={[Pagination, Navigation]}>

                {listings.map((listing, index) => (
                    <SwiperSlide key={index}>
                        <div style={{
                            bakgroundSize: 'cover'
                        }}>
                            <img src={listing.data.imgUrls[0]} alt="listing" className={'swiperSlideDiv'}/>
                            <p className="swiperSlideText">{listing.data.name}</p>
                            <p className="swiperSlidePrice">
                                ${listing.data.discountedPrice ?? listing.data.regularPrice} {listing.data.type == 'rent' && '/ month'}
                            </p>
                        </div>


                    </SwiperSlide>
                ))}

            </Swiper>

        </>
    )
}

export default Slider;