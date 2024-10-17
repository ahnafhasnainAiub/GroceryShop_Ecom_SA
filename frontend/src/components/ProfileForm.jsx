import React, { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useProfileMutation } from "../slices/usersApiSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Loader from "./Loader";
import { saveShippingAddress } from "../slices/cartSlice";

const ProfileForm = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { shippingAddress } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
  const [country, setCountry] = useState(shippingAddress.country || "");

  const [name, setName] = useState(userInfo?.name || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);

  const [updateProfile, { isLoading: isUpdateProfileLoading }] = useProfileMutation();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmShowPassword(!showConfirmPassword);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password.length < 1) {
      dispatch(
        saveShippingAddress({
          address,
          city,
          postalCode,
          country,
        })
      );
    }

    try {
      if (password !== confirmPassword) {
        return toast.error("Passwords do not match!");
      }
      const res = await updateProfile({ name, email, address, city, postalCode, country, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success(res.message);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <Form onSubmit={submitHandler}>
      <Form.Group className="mb-3" controlId="name">
        <Form.Control value={name} type="text" placeholder="Enter name" onChange={(e) => setName(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="email">
        <Form.Control value={email} type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="address">
        <Form.Control value={address} type="text" placeholder="Enter address" onChange={(e) => setAddress(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="city">
        <Form.Control value={city} type="text" placeholder="Enter city" onChange={(e) => setCity(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="postalCode">
        <Form.Control value={postalCode} type="text" placeholder="Enter postal code" onChange={(e) => setPostalCode(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="country">
        <Form.Control value={country} type="text" placeholder="Enter country" onChange={(e) => setCountry(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="password">
        <InputGroup>
          <Form.Control type={showPassword ? "text" : "password"} value={password} placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
          <InputGroup.Text onClick={togglePasswordVisibility} id="togglePasswordVisibility" style={{ cursor: "pointer" }}>
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </InputGroup.Text>
        </InputGroup>
      </Form.Group>
      <Form.Group className="mb-3" controlId="confirmPassword">
        <InputGroup>
          <Form.Control type={showConfirmPassword ? "text" : "password"} value={confirmPassword} placeholder="Confirm password" onChange={(e) => setConfirmPassword(e.target.value)} />
          <InputGroup.Text onClick={toggleConfirmPasswordVisibility} id="toggleConfirmPasswordVisibility" style={{ cursor: "pointer" }}>
            {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
          </InputGroup.Text>
        </InputGroup>
      </Form.Group>
      <Button className="mb-3 w-100" variant="warning" type="submit">
        Update
      </Button>
      {isUpdateProfileLoading && <Loader />}
    </Form>
  );
};

export default ProfileForm;
