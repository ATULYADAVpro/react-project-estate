import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { useEffect, useState } from "react"
import { app } from "../firebase"
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from "react-router-dom"

export default function UpdateListing() {
    const { currentUser } = useSelector(state => state.user)
    const navigate = useNavigate();
    const [file, setFile] = useState([])
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,

    })
    const [imageUploadError, setImageUploadError] = useState(false)
    const [uploading, setUploading] = useState(false);
    const [error, setEror] = useState(false)
    const [loading, setLoading] = useState(false)
    const params = useParams();

    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId
            const res = await fetch(`/api/listing/get/${listingId}`);
            const data = await res.json();
            if(data.success === false){
                console.log(data.message)
                return;
            }
            setFormData(data)
        }

        fetchListing()

    },[])



    const handleImageSubmit = (e) => {
        // e.preventDefault();

        if (file.length > 0 && file.length + formData.imageUrls.length < 7) {
            setUploading(true)
            setImageUploadError(false)
            const promises = []
            // console.log(promises)
            for (let i = 0; i < file.length; i++) {
                promises.push(storeImage(file[i]));
            }
            Promise.all(promises).then((urls) => {
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) })
                setImageUploadError(false)
                setUploading(false)
            }).catch((err) => {
                setImageUploadError("image upload failed (2 mb max per image")
                setUploading(false)
            })
        } else {
            setImageUploadError("You can only upload 6 img per listing")
            setUploading(false)
        }


    }

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(progress)
                },
                (error => { reject(error) }),
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL)
                    })
                })
        })
    }

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((url, i) => i !== index),
        })
    }

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({ ...formData, type: e.target.id })
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({ ...formData, [e.target.id]: e.target.checked })
        }

        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({ ...formData, [e.target.id]: e.target.value })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1) { return setEror("at lest one img") }
            if (formData.regularPrice < +formData.discountPrice) { return setEror("discount price must be lower then regular price") }

            setLoading(true)
            setEror(false)
            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData, userRef: currentUser._id,
                })
            })
            const data = await res.json();
            setLoading(false)
            if (data.success === false) {
                setEror(data.message)
                setLoading(false)
            }
            navigate(`/listing/${data._id}`)
        } catch (error) {
            setEror(error.message)
        }
    }

    return (
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Update a listing</h1>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-4 flex-1">
                    <input type="text" onChange={handleChange} value={formData.name} placeholder="Name" className="border p-3 rounded-lg" id="name" maxLength={'62'} minLength={'10'} required />

                    <textarea type="text" onChange={handleChange} value={formData.description} placeholder="Description" className="border p-3 rounded-lg" id="description" required />

                    <input type="text" onChange={handleChange} value={formData.address} placeholder="Address" className="border p-3 rounded-lg" id="address" required />

                    <div className="flex gap-6 flex-wrap">

                        <div className="flex gap-2">
                            <input type="checkbox" onChange={handleChange} checked={formData.type === 'sale'} id="sale" className="w-5" />
                            <span>Sell</span>
                        </div>

                        <div className="flex gap-2">
                            <input type="checkbox" onChange={handleChange} checked={formData.type === 'rent'} id="rent" className="w-5" />
                            <span>Rent</span>
                        </div>

                        <div className="flex gap-2">
                            <input type="checkbox" onChange={handleChange} checked={formData.parking} id="parking" className="w-5" />
                            <span>Parking spot</span>
                        </div>

                        <div className="flex gap-2">
                            <input type="checkbox" onChange={handleChange} checked={formData.furnished} id="furnished" className="w-5" />
                            <span>Furnished</span>
                        </div>

                        <div className="flex gap-2">
                            <input type="checkbox" onChange={handleChange} checked={formData.offer} id="offer" className="w-5" />
                            <span>Offer</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input type="number" id="bedrooms" onChange={handleChange} value={formData.bedrooms} min='1' max='10' required className="p-3 border-gray-300 rounded-lg" />
                            <p>Beds</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" onChange={handleChange} value={formData.bathrooms} id="bathrooms" min='1' max='10' required className="p-3 border-gray-300 rounded-lg" />
                            <p>Baths</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" onChange={handleChange} value={formData.regularPrice} id="regularPrice" required className="p-3 border-gray-300 rounded-lg" />
                            <div className="flex flex-col items-center">
                                <p>Regular price</p>
                                <span className="text-xs">($ / month)</span>
                            </div>
                        </div>

                        {formData.offer && (
                            <div className="flex items-center gap-2">
                                <input type="number" onChange={handleChange} value={formData.discountPrice} id="discountPrice" required className="p-3 border-gray-300 rounded-lg" />
                                <div className="flex flex-col items-center">
                                    <p>Discount price</p>
                                    <span className="text-xs">($ / month)</span>
                                </div>
                            </div>
                        )}



                    </div>

                </div>

                <div className="flex flex-col flex-1 gap-4">
                    <p className="font-semibold">Image:
                        <span className="font-normal text-grai-600 ml-2">The first image will be the cover (max 6)</span>
                    </p>
                    <div className="flex gap-4">
                        <input onChange={(e) => setFile(e.target.files)} className="p-3 border border-gray-300 rounded w-full" type="file" id="images" accept="image/*" multiple />
                        <button type="button" disabled={uploading} onClick={handleImageSubmit} className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">{uploading ? "Uploading" : "Upload"}</button>

                    </div>
                    <p className="text-red-700">{imageUploadError && imageUploadError}</p>
                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                            <div className="flex justify-between p-3 border items-center" key={url}>
                                <img src={url} alt="imge" className="w-20 h-20 object-contain rounded-lg" />
                                <button type="button" onClick={() => handleRemoveImage(index)} className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75">Delete</button>
                            </div>
                        ))
                    }
                    <button disabled={loading || uploading} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">{loading ? "Updating" : "Update Listing"}</button>
                    {error && <p className="text-red-700 text-sm">{error}</p>}
                </div>


            </form>
        </main>
    )
}
