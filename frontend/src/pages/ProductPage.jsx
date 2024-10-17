import React, { useState } from "react";
import { Row, Col, ListGroup, Button, Image, Card, Form, ListGroupItem } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetProductDetailsQuery, useCreateProductReviewMutation } from "../slices/productsApiSlice";
import { addToCart } from "../slices/cartSlice";
import { toast } from "react-toastify";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";
import { addCurrency } from "../utils/addCurrency";
import Reviews from "../components/Reviews";

const ProductPage = () => {
  const { id: productId } = useParams();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

  const [createProductReview, { isLoading: isCreateProductReviewLoading }] = useCreateProductReviewMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await createProductReview({
        productId,
        rating,
        comment,
      });
      if (res.error) {
        toast.error(res.error?.data?.message);
      }
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }

    setRating(0);
    setComment("");
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <Link to="/" className="btn btn-outline-dark my-3">
            &larr; Go Back
          </Link>
          <Meta title={product.name} description={product.description} />
          <Row className="flex-column-reverse flex-md-row">
            <Col md={7} className="d-flex flex-column align-items-center">
              <Image src={product.image} alt={product.name} fluid rounded className="shadow-sm mb-4" />
              <ListGroup variant="flush" className="w-100">
                <ListGroup.Item className="bg-light p-4">
                  <h2 className="fw-bold">{product.name}</h2>
                </ListGroup.Item>
                <ListGroup.Item className="bg-light p-4">
                  <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                </ListGroup.Item>
                <ListGroup.Item className="bg-light p-4">
                  <h4 className="text-muted">Price: {addCurrency(product.price)}</h4>
                </ListGroup.Item>
                <ListGroup.Item className="bg-light p-4">
                  <h5 className="fw-bold">About this item:</h5>
                  <p className="mt-3">{product.description}</p>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={5}>
              <Card className="shadow-sm">
                <ListGroup variant="flush">
                  <ListGroup.Item className="bg-dark text-white p-4">
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>{addCurrency(product.price)}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item className="p-4">
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? "In Stock" : "Out Of Stock"} ({product.countInStock}kg)
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item className="p-4">
                      <Row>
                        <Col>Qty:</Col>
                        <Col>
                          <Form.Control as="select" value={qty} onChange={(e) => setQty(Number(e.target.value))} className="form-select">
                            {Array.from({ length: product.countInStock }, (_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroupItem className="p-4">
                    <Button className="w-100 btn-lg" variant="primary" type="button" disabled={product.countInStock === 0} onClick={addToCartHandler}>
                      Add To Cart
                    </Button>
                  </ListGroupItem>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className="review d-block d-md-none mt-5">
            <Col>
              <Reviews product={product} userInfo={userInfo} rating={rating} laoding={isCreateProductReviewLoading} setRating={setRating} comment={comment} setComment={setComment} submitHandler={submitHandler} />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductPage;
