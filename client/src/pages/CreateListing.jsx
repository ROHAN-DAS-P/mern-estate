import React from 'react'
import { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import { set } from 'mongoose';

export default function CreateListing() {
    const[files, setFiles] = useState([])
    const [formData, setFormData] = useState({
        imageUrls: [],
    })
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    console.log(formData);

    
    
    const handleImageSubmit = (e) => {
        if (files.length >0 && files.length + formData.imageUrls.length < 7){
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(
                    storeImage(files[i])
                );
            }
            Promise.all(promises)
                .then((urls) => {
                    setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)});
                    setImageUploadError(false);
                    setUploading(false);
            
                }).catch((err) => {
                    
                    setImageUploadError("image upload failed 2mb max per file");
                    setUploading(false);
                });
        }else {
            setImageUploadError("You can only upload 6 images at a time");
            setUploading(false);
        }
    }

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress + "% done");
                },
                (error) => {
                    console.error("Error uploading file:", error);
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            });
        });
    }

    const handleRemoveImage = (index) => () => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index)
        });
    }

  return (
    <main className = 'p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a New Listing</h1>
        <form className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex flex-col gap-4">
                <input type="text" placeholder='Name' className= 'border p-3 rounded-lg' id='name' maxLength='62' minLength='10' required />
                <textarea type="text" placeholder='Description' className= 'border p-3 rounded-lg' id='description' required />
                <input type="text" placeholder='Address' className= 'border p-3 rounded-lg' id='address' />
                <div className="flex gap-6 flex-wrap">
                    <div className='flex gap-2'>
                        <input type="checkbox" id='sale' className='w-5' />
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='rent' className='w-5' />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='parking' className='w-5' />
                        <span>Parking spot</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='furnished' className='w-5' />
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='offer' className='w-5' />
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-6">
                    <div className='flex items-center gap-2'>
                        <input type="number" id = 'bedrooms' min='1' max='10' required
                        className='p-3 border border-gray-300 rounded-lg' />
                        <p>Beds</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type="number" id = 'bathrooms' min='1' max='10' required
                        className='p-3 border border-gray-300 rounded-lg' />
                        <p>Baths</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type="number" id = 'regularPrice' min='1' max='10' required
                        className='p-3 border border-gray-300 rounded-lg' />
                        <div className='flex flex-col items-center'>
                            <p>Regular price</p>
                            <span className='text-xs'>($ / month)</span>
                        </div>
                        

                    </div>
                    <div className='flex items-center gap-2'>
                        <input type="number" id = 'discountPrice' min='1' max='10' required
                        className='p-3 border border-gray-300 rounded-lg' />
                        <div className='flex flex-col items-center'>
                            <p>Discounted price</p>
                            <span className='text-xs'>($ / month)</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className=" flex flex-col flex-1 gap-4">
                <p className='font-semibold'>Images:
                    <span className='font-normal text-grey-600 ml-2'>
                        The first image will be the cover image (max 6)
                    </span>
                </p>
                <div className="flex gap-4">
                    <input
                    onChange={(e) => setFiles(e.target.files)}
                    type="file" id='image' accept='image/*' multiple className='p-3 border border-gray-300 rounded w-full' />
                    <button disabled={uploading} type='button' onClick={handleImageSubmit} className='bg-blue-500 text-white p-3 rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading ? "Uploading..." : "Upload"}</button>
                </div>
                <p className='text-red-500'>{imageUploadError && imageUploadError}</p> 
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                        <div key={url} className='flex justify-between p-3 border item-center'>
                            <img src={url} alt="listing of image" className='w-32 h-32 object-contain rounded-lg' />
                            <button type='button' onClick={() => handleRemoveImage(index)} className='bg-red-500 text-white p-3 rounded-lg mt-2 uppercase hover:opacity-90'>Remove</button>
                        </div>
                    ))

                }

            <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled: opacity-85'>Create Listing</button>
            </div>
        </form>
    </main>
  )
}
