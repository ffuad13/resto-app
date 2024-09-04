"use client"

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

/**
 * Sends a POST request to create a new menu item.
 * @param {CreateMenuData} data The menu item data to be sent.
 * @returns {Promise<any>} The response data in JSON format.
 * @throws {Error} If the request fails.
 */

interface CreateMenuData {
  name: string;
  price: number | string;
}

async function createMenu(data: CreateMenuData): Promise<any> {
  const res = await fetch("http://127.0.0.1:8000/api/menu/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create data")

  return res.json();
}

interface FormData {
  name: string;
  price: string;
}

const Page: React.FC = () => {
	const router = useRouter()
	const [formData, setFormData] = useState<FormData>({name: "", price: ""})
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

	/**
   * Handles the form submission.
   * @param {React.FormEvent<HTMLFormElement>} event The form submission event.
   */

	const onFinish = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setIsLoading(true)
		createMenu(formData).then(() => {
			router.replace("/?action=add")
		}).catch(() => {
			setError("An error occured")
			setIsLoading(false)
		})
	}

	useEffect(() => {
		return () => setIsLoading(false)
	}, [])

	return (
		<form onSubmit={onFinish}>
			<div className='form-item'>
				<label htmlFor="name">Name</label>
				<input required name='name' value={formData.name} onChange={(event) => setFormData({...formData, name: event.target.value})} />
			</div>
			<div className='form-item'>
				<label htmlFor="price">Price</label>
				<input required type='number' name='price' value={formData.price} onChange={(event) => setFormData({...formData, price: event.target.value})} />
			</div>
			{error && <p className='error-message'>{error}</p>}
			<div>
				<button disabled={isLoading} className='add-button' type='submit'>Submit</button>
			</div>
		</form>
	)
}

export default Page