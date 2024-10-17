import React, { useState } from "react";
import Meta from "../../components/Meta";
import { useAdminsQuery } from "../../slices/usersApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Button, Col, Row, Table, Form } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

const AdminListPage = () => {
  const { data: admins, isLoading, error } = useAdminsQuery({});
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  // Filter admins based on search term
  const filteredAdmins = admins?.filter((admin) => admin.name.toLowerCase().includes(searchTerm.toLowerCase()) || admin.email.toLowerCase().includes(searchTerm.toLowerCase()) || admin._id.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <Meta title={"Admin List"} />
          <h1 className="text-white">Admins</h1>
        </Col>
        <Col className="text-end">
          <LinkContainer to={"/admin/create"}>
            <Button className=" my-3" variant="warning">
              Add Admin
            </Button>
          </LinkContainer>
        </Col>
      </Row>

      {/* Search Input */}
      <Row className="my-3">
        <Col>
          <Form.Control
            type="text"
            placeholder="Search by name, email, or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          />
        </Col>
      </Row>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <Table striped hover bordered responsive size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins?.map((admin) => (
              <tr key={admin._id}>
                <td>{admin._id}</td>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>
                  <LinkContainer to={`/admin/user/update/${admin._id}`}>
                    <Button className="btn-sm" variant="light">
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  <Button className="btn-sm" variant="light" onClick={() => {}}>
                    <FaTrash style={{ color: "red" }} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default AdminListPage;
