import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase"
import { updateUserFailure, updateUserSuccess, updateUserStart, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserSuccess, signOutUserStart } from "../redux/user/userSlice"
import { Link } from "react-router-dom"

export default function Profile() {
  // =============== State Here ==============
  const { currentUser, loading, error } = useSelector(state => state.user)
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({})
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showListingsError, setShowListingsError] = useState(false)
  const [userListings, setUserListings] = useState([])
  // =============== Fun and log ==========

  // console.log(userListings)

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;

    const storageRef = ref(storage, fileName)

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePercentage(Math.round(progress))
    },
      (error) => {
        setFileUploadError(true)
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL })
        })

      })

  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }

  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      })

      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      // setUpdateSuccess(true)

    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch(`/api/auth/signout`)
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message))
    }
  }

  const handleShowListings = async () => {
    try {
      setShowListingsError(false)
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false) {
        setShowListingsError(true)
        return;
      }
      setUserListings(data)
    } catch (error) {
      setShowListingsError(true);
    }
  }

  const handleListingDelete = async (listId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listId}`, {
        method: 'DELETE',
      })

      const data = await res.json();
      if (data.success === false) {
        console.log(error.message)
        return;
      }

      setUserListings((prev) => prev.filter((listing) => listing._id !== listId))

    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" />
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile-img" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" />

        <p className="text-sm self-center">
          {fileUploadError ? (<span className="text-red-700">Error Image Upload (img must be less then 2 mb and only img formData) </span>) : (filePercentage > 0 && filePercentage < 100) ? (<span className="text-slate-700">{`Uploading ${filePercentage}%`}</span>) : (filePercentage === 100) ? (<span className="text-green-700">Successfully uploaded!</span>) : ""}
        </p>

        <input type="text" onChange={handleChange} defaultValue={currentUser.username} id="username" placeholder="username" className="border p-3 rounded-lg" />
        <input type="text" onChange={handleChange} defaultValue={currentUser.email} id="email" placeholder="email" className="border p-3 rounded-lg" />
        <input type="text" onChange={handleChange} defaultValue={currentUser.password} id="password" placeholder="password" className="border p-3 rounded-lg" />

        <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">{loading ? "Loading..." : "Upadte"}</button>

        <Link className="bg-green-700 text-white p-2 rounded-lg uppercase text-center hover:opacity-95" to={'/create-listing'}> Create Listing

        </Link>

      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer ">Delete account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer ">Sign Out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? "Update successfull! " : ""}</p>

      <button onClick={handleShowListings} className="text-green-700 w-full">Show Listings</button>
      <p className="text-red-700 mt-5">{showListingsError ? 'Error showing listings' : ""}</p>

      {userListings && userListings.length > 0 &&

        <div className="flex flex-col gap-4">
          <h1 className="text-center my-7 text-2xl font-semibold">Your Listings</h1>
          {userListings.map((list) => {
            return <div className="border rounded-lg p-3 flex justify-between items-center gap-4" key={list._id}>
              <Link to={`/listing/${list._id}`}>
                <img src={list.imageUrls[0]} alt="img" className="h-16 w-16 object-contain " />
              </Link>
              <Link className="text-slate-700 font-semibold flex-1 hover:underline truncate" to={`/listing/${list._id}`}>
                <p >{list.name}</p>
              </Link>

              <div className=" flex flex-col items-center">
                <button onClick={() => handleListingDelete(list._id)} className="text-red-700 uppercase">Delete</button>
                <Link to={`/update-listing/${list._id}`} >
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>


            </div>
          })}
        </div>


      }

    </div>
  )
}
