import React, { useEffect, useState } from 'react';

export function Products() {
    const [content, setContent] = useState(<ProductList showForm={showForm} />);

    function showList() {
        setContent(<ProductList showForm={showForm} />);
    }

    function showForm(product) {
        setContent(<ProductForm product={product} showList={showList} />);
    }

    return (
        <div className="container my-5">
            {content}
        </div>
    );
}

function ProductList(props) {
    const [products, setProducts] = useState([]);

    function fetchProducts() {
        fetch("http://localhost:3004/products")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Unexpected Server Response");
                }
                return response.json();
            })
            .then((data) => {
                setProducts(data);
            })
            .catch((error) => console.log("Error: ", error));
    }

    useEffect(() => fetchProducts(), []);

    function deleteProduct(id) {
        fetch(`http://localhost:3004/products/${id}`, {
            method: 'DELETE'
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => fetchProducts())
            .catch((error) => console.log('Error:', error));
    }

    return (
        <>
            <h2 className="text-center mb-3">List Of Cources</h2>
            <button onClick={() => props.showForm({})} type="button" className="btn btn-primary me-2">Create</button>
            <button onClick={() => fetchProducts()} type="button" className="btn btn-outline-primary me-2">Refresh</button>

            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>CourceName</th>
                        <th>TeacherName</th>
                        <th>Price</th>
                        <th>Image</th>
                        <th>Description (PDF)</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.map((product, index) => {
                            return (
                                <tr key={index}>
                                    <td>{product.id}</td>
                                    <td>{product.coursename}</td>
                                    <td>{product.teacher}</td>
                                    <td>{product.price}$</td>

                                    <td><img src= {"http://localhost:3004/" + product.imageFile } width="100" alt ="..." /></td>
                                    <td>
                                         {/* Description as a link */}
                                         <a href={"http://example.com/descriptions/" + product.pdfFile} target="_blank" rel="noopener noreferrer">
                                         AboutCourse
                                         </a>
                                    </td>

                                    
                                   
                                    
                                    <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                                        <button onClick={() => props.showForm(product)} type="button" className="btn btn-primary btn-sm me-2">Edit</button>
                                        <button onClick={() => deleteProduct(product.id)} type="button" className="btn btn-danger btn-sm">Delete</button>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </>
    );
}

function ProductForm(props) {
    const [errorMessage, setErrorMessage] = useState('');
    const [imageFile, setImageFile] = useState('');
    const [pdfFile, setPdfFile] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
    
        // Read form data
        const formData = new FormData(event.target);
    
        // Convert formData to object
        const product = Object.fromEntries(formData.entries());
    
        // Form validation
        if (!product.coursename || !product.teacher || !product.imageFile || !product.price ||!product.pdfFile ) {
            console.log("Please Provide all the Required fields!");
            setErrorMessage(
                <div className="alert alert-worning" role= "alert">
                    Please Provide All required Fields!
                </div>
                )
            return;
        }
    
        if (props.product.id) {
            // Update the product
            fetch("http://localhost:3004/products/" + props.product.id, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product)
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not Ok");
                    }
                    return response.json();
                })
                .then((data) => props.showList())
                .catch((error) => {
                    console.log("Error: ", error);
                });
        } else {
            // Create a new product
            product.createdAt = new Date().toISOString().slice(0, 10);
    
            fetch("http://localhost:3004/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product)
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not Ok");
                    }
                    return response.json();
                })
                .then((data) => props.showList())
                .catch((error) => {
                    console.log("Error: ", error);
                });
        }
    }

    const handleImageChange = (event) => {
        setImageFile(event.target.files[0]);
    };

    const handlePdfChange = (event) => {
        setPdfFile(event.target.files[0]);
    };
    
    return (
        <>
            <h2 className="text-center mb-3">{props.product.id ? "Edit Product" : "Create New Product"}</h2>

            <div className="row">
                <div className="col-lg-6 mx-auto">
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                    <form onSubmit={(event) => handleSubmit(event)}>
                        {props.product.id && (
                            <div className="row mb-3">
                                <label className="col-sm-4 col-form-label">ID</label>
                                <div className="col-sm-8">
                                    <input readOnly className="form-control-plaintext"
                                        name= "id"
                                        defaultValue={props.product.id} />
                                </div>
                            </div>
                        )}

                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">CourceName</label>
                            <div className="col-sm-8">
                                <input className="form-control"
                                    name="coursename"
                                    defaultValue={props.product.coursename} />
                                    <span className="text-danger"></span>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">TeacherName</label>
                            <div className="col-sm-8">
                                <input className="form-control"
                                    name="teacher"
                                    defaultValue={props.product.teacher} />
                                    <span className="text-danger"></span>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Price</label>
                            <div className="col-sm-8">
                                <input className="form-control"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    defaultValue={props.product.price} />
                                    <span className="text-danger"></span >
                            </div>
                        </div>



                        <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Image</label>
                    <div className="col-sm-8">
                        <input
                            className="form-control"
                            type="file"
                            name="imageFile"
                            onChange={handleImageChange}
                        />
                        <span className="text-danger"></span>
                    </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Description (PDF)</label>
                    <div className="col-sm-8">
                        <input
                            className="form-control"
                            type="file"
                            accept=".pdf"
                            name="pdfFile"
                            onChange={handlePdfChange}
                        />
                    </div>
                </div>


                        <div className="row">
                            <div className="offset-sm-4 col-sm-4 d-grid">
                                <button type="submit" className="btn btn-primary btn-sm me-3">Save</button>
                            </div>
                            <div className="col-sm-4 d-grid">
                                <button onClick={() => props.showList()} type="button" className="btn btn-secondary me-2">Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
