import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useCreateProductMutation, useGetProductDetailsQuery, useUpdateProductMutation, useUploadProductImageMutation } from "../../slices/productsApiSlice";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import Meta from "../../components/Meta";

const ProductFormPage = () => {
  const { id: productId } = useParams();

  const isUpdateMode = !!productId;

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0); // New state for discountPercent
  const [discountPrice, setDiscountPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);

  const getProductQueryResult = useGetProductDetailsQuery(productId);

  const { data: product, isLoading, error } = isUpdateMode ? getProductQueryResult : { data: null, isLoading: false, error: null };

  const [createProduct, { isLoading: isCreateProductLoading }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdateProductLoading }] = useUpdateProductMutation();
  const [uploadProductImage, { isLoading: isUploadImageLoading }] = useUploadProductImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (isUpdateMode && product) {
      setName(product.name);
      setImage(product.image);
      setDescription(product.description);
      setBrand(product.brand);
      setCategory(product.category);
      setPrice(product.price);
      setDiscountPercent(Math.round(((product.price - product.discountPrice) / product.price) * 100)); // Calculate discountPercent if it exists
      setDiscountPrice(product.discountPrice || 0);
      setCountInStock(product.countInStock);
    }
  }, [isUpdateMode, product]);

  useEffect(() => {
    const calculatedDiscountPrice = (price - (price * discountPercent) / 100).toFixed(2);
    setDiscountPrice(calculatedDiscountPrice);
  }, [price, discountPercent]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      setImage(res.imageUrl);
      toast.success(res.message);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        name,
        image,
        description,
        brand,
        category,
        price,
        discountPrice,
        countInStock,
      };
      if (isUpdateMode) {
        const { data } = await updateProduct({
          productId,
          ...productData,
        });
        toast.success(data.message);
      } else {
        const { data } = await createProduct(productData);
        toast.success(data.message);
      }
      navigate("/admin/product-list");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <Meta title={"Product Form"} />
      <Link to="/admin/product-list" className="btn btn-light my-3">
        Go Back
      </Link>
      {(isUpdateProductLoading || isCreateProductLoading || isUploadImageLoading) && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <FormContainer>
          <Meta title={"Product Form"} />
          <h1 className="text-white">{isUpdateMode ? "Update Product" : "Create Product"}</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label className="text-white">Name</Form.Label>
              <Form.Control type="name" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label className="text-white">Price</Form.Label>
              <Form.Control type="number" placeholder="Enter price" value={price} onChange={(e) => setPrice(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId="discountPercent">
              <Form.Label className="text-white">Discount Percent</Form.Label>
              <Form.Control type="number" placeholder="Enter discount percent" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} min="1" max="100"></Form.Control>
            </Form.Group>

            <Form.Group controlId="discountPrice">
              <Form.Label className="text-white">Discount Price</Form.Label>
              <Form.Control type="number" placeholder="Calculated discount price" value={discountPrice} readOnly></Form.Control>
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label className="text-white">Image</Form.Label>
              <Form.Control type="file" onChange={uploadFileHandler}></Form.Control>
            </Form.Group>

            <Form.Group controlId="brand">
              <Form.Label className="text-white">Brand</Form.Label>
              <Form.Control type="text" placeholder="Enter brand" value={brand} onChange={(e) => setBrand(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock">
              <Form.Label className="text-white">Count In Stock</Form.Label>
              <Form.Control type="number" placeholder="Enter countInStock" value={countInStock} onChange={(e) => setCountInStock(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label className="text-white">Category</Form.Label>
              <Form.Control type="text" placeholder="Enter category" value={category} onChange={(e) => setCategory(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label className="text-white">Description</Form.Label>
              <Form.Control as="textarea" rows={3} type="text" placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)}></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" style={{ marginTop: "1rem" }}>
              {isUpdateMode ? "Update Product" : "Create Product"}
            </Button>
          </Form>
        </FormContainer>
      )}
    </>
  );
};

export default ProductFormPage;
