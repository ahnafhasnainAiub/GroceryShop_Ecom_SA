import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCurrency } from "../utils/addCurrency";
import { addToCart } from "../slices/cartSlice";
import Rating from "./Rating";

const Product = ({ product }) => {
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };
  return (
    <Card className="my-3 p-3 rounded text-center">
      <Link to={`/product/${product._id}`} style={{ textDecoration: "none" }} className="text-dark">
        <Card.Img variant="top" src={product.image} style={{ height: "200px", objectFit: "contain" }} />
        <Card.Body>
          <Card.Text as="div" className="mb-3">
            <Rating value={product.rating} text={`(${product.numReviews} reviews)`} />
          </Card.Text>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "column", gap: 16 }}>
            <Card.Title className="product-title" style={{ fontSize: "1.5rem", marginBottom: 0, textAlign: "left", overflow: "hidden", maxWidth: "full" }}>
              <strong>{product.name}</strong>
            </Card.Title>
            <div>
              <p>{Math.ceil(((product.price - product?.discountPrice) / product.price) * 100)}% Discount</p>
              <Card.Text as="h3" style={{ fontSize: "1.5rem", display: "flex", alignItems: "start" }}>
                {addCurrency(product?.discountPrice)}
                <p style={{ fontSize: "0.7rem" }}>/kg</p>
              </Card.Text>
              <Card.Text as="h3" hidden={product.price === product?.discountPrice} style={{ fontSize: "1.5rem", display: "flex", alignItems: "start", textDecoration: "line-through", color: "red" }}>
                {addCurrency(product.price)}
                <p style={{ fontSize: "0.7rem" }}>/kg</p>
              </Card.Text>
            </div>
          </div>
        </Card.Body>
      </Link>
      <Button variant="primary" type="button" disabled={product.countInStock === 0} onClick={addToCartHandler}>
        Add To Cart
      </Button>
    </Card>
  );
};

export default Product;
