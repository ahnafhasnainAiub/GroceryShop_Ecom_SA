import React, { useEffect, useState } from "react";
import FormContainer from "../../components/FormContainer";
import { Button, Form } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useUpdateUserMutation, useGetUserByIdQuery } from "../../slices/usersApiSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import Meta from "../../components/Meta";
import axios from "axios";

const CreateUserFormPage = () => {
  const { id: userId } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUpdateUserLoading, setIsUpdateUserLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setIsUpdateUserLoading(true);
      const userData = { name, email, password, isAdmin };
      const { data } = await axios.post("/api/v1/users", userData);
      toast.success(data.message);
      navigate("/admin/admin-list");
    } catch (error) {
      setIsUpdateUserLoading(false);
      toast.error(error?.data?.message || error.error);
    }
  };
  return (
    <div className="text-white">
      <Meta title={"User Update Form"} />

      <Link to="/admin/user-list" className="btn btn-light my-3">
        Go Back
      </Link>
      {isUpdateUserLoading && <Loader />}

      <FormContainer>
        <Meta title={"Update User"} />
        <h1>Create Admin</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control value={name} type="text" placeholder="Enter name" onChange={(e) => setName(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control value={email} type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control value={password} type="password" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="isAdmin">
            <Form.Check type="checkbox" label="is Admin" checked={true} disabled onChange={(e) => setIsAdmin(e.target.checked)} />
          </Form.Group>

          <Button className="mb-3" variant="primary" type="submit">
            Update
          </Button>
        </Form>
      </FormContainer>
    </div>
  );
};

export default CreateUserFormPage;
