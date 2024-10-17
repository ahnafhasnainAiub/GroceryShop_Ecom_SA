import React, { useState, useEffect } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { savePaymentMethod } from "../slices/cartSlice";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import Meta from "../components/Meta";

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("bKash");
  const [bkashNum, setBkashNum] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { shippingAddress } = useSelector((state) => state.cart);

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    if (paymentMethod === "bKash") {
      localStorage.setItem("bkash", bkashNum);
    }
    navigate("/place-order");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <Meta title={"Payment Method"} />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            <Form.Check className="my-2" type="radio" id="bKash" label="bKash" name="paymentMethod" value="bKash" checked={paymentMethod === "bKash"} onChange={(e) => setPaymentMethod(e.target.value)} />
            {paymentMethod === "bKash" && (
              <Form.Group className="mb-3" controlId="bkashNum">
                <Form.Label>bKash Number</Form.Label>
                <Form.Control value={bkashNum} type="text" placeholder="Enter bKash Number" onChange={(e) => setBkashNum(e.target.value)} />
              </Form.Group>
            )}
            <Form.Check className="my-2" type="radio" id="cashOnDelivery" label="Cash on Delivery" name="paymentMethod" value="Cash on Delivery" checked={paymentMethod === "Cash on Delivery"} onChange={(e) => setPaymentMethod(e.target.value)} />
          </Col>
        </Form.Group>
        <Button className="mb-3 w-100" variant="warning" type="submit">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default Payment;
