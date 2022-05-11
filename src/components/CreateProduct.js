import React, { useState, useEffect, Component } from 'react';
import { Container, Col, Form, Button,  } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
// import FileUploader from './Uploader'

// Work on setting validation for file size
// Not yet pushed to heroku

export default function CreateProduct() {

	// let fileUpload = Upload

	let [productName, setProductName] = useState('');
	let [description, setDescription] = useState('');
	let [sellingPrice, setSellingPrice] = useState('');
	let [stock, setStock] = useState('');	
	let [isFilled, setIsFilled] = useState(false);
	let [isActive, setIsActive] = useState(false);
	let [productImg, setProductImg] = useState('')
	let toggleChecked = () => setIsActive(value => !value)


	useEffect(() => {
		if (productName !== '' && description !== '' && sellingPrice !== '' && stock !== '' && productImg !== '') {
			setIsFilled(true);			
		} else {
			setIsFilled(false);
		}
	},[productName, description, sellingPrice, stock])	

	const changeHandler = (event) => {
		setProductName(event.target.files)
		setDescription(event.target.files)
		setSellingPrice(event.target.files)
		setStock(event.target.files)
		setProductImg(event.target.files[0])
	}
	// console.log(changeHandler)

	const handleSubmission = () => {

	};

	
	const createListing = async (submitEvent) => {		
		submitEvent.preventDefault();
		let userCredentials = localStorage.accessToken;	
		const formData = new FormData();
		formData.append('productName', productName);
		formData.append('description', description);
		formData.append('sellingPrice', sellingPrice);
		formData.append('stock', stock);
		formData.append('isActive', isActive);
		formData.append('productImg', productImg)

		const isCreated = await fetch('http://localhost:8000/products/', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${userCredentials}`				
			}, 
			body: formData
		}).then(result => result.json()).then(itemData => {
			console.log(itemData)
			if (itemData) {
				return true;
			} else {
				return false;
			}

		})

		if (isCreated) {
			setProductName('');
			setDescription('');
			setSellingPrice('');
			setStock('');
			setIsActive(false);

			await Swal.fire({
				icon: "success",
				text: "New product listing is created"
			});

			window.location.href="/manage-product";
		} else {
			await Swal.fire({
				icon: "error",
				text: "Check all fields"
			});
		}		
	};	

	
	return(
		<>

		<Container>
		<Col className='p-5'>
			<Form  >
				<Form.Group>
					<Form.Label>Product Name</Form.Label>
					<Form.Control 
					type="text" 
					required 
					value={productName}
					onChange={event => setProductName(event.target.value)}
					/>
				</Form.Group>

				<Form.Group>
					<Form.Label>Description</Form.Label>
					<Form.Control 
					type="text" 
					required
					value={description}
					onChange={e => setDescription(e.target.value)} 
					/>
				</Form.Group>

				<Form.Group>
					<Form.Label>Price</Form.Label>
					<Form.Control 
					type="number" 
					required
					value={sellingPrice}
					onChange={e => setSellingPrice(e.target.value)}
					/>
				</Form.Group>

				<Form.Group>
					<Form.Label>Stock</Form.Label>
					<Form.Control 
					type="number" 
					required
					value={stock}
					onChange={e => setStock(e.target.value)} 
					/>
				</Form.Group>

				<div className="mb-4">
					<input 
					type="checkbox" 
					checked={isActive} 					
					onChange={toggleChecked} /> Display product as Active
				</div>

				
				<input type="file" onChange={e => setProductImg(e.target.files[0])} />	<br/><br/>	

				{
					isFilled ?
						<Button onClick={e => createListing(e)} className="createBtn">Create Product</Button>
					:
						<Button className="createBtn" disabled>Create Product</Button>	
				}						
				
			</Form>		

		</Col>			
		</Container>
		</>
	)

}
