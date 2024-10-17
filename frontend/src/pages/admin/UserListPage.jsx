import React, { useState } from "react";
import { Button, Table, Form } from "react-bootstrap";
import { FaCheck, FaTrash, FaXmark } from "react-icons/fa6";
import { LinkContainer } from "react-router-bootstrap";
import { FaEdit } from "react-icons/fa";
import { useGetUsersQuery, useDeleteUserMutation } from "../../slices/usersApiSlice";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Meta from "../../components/Meta";

const UserListPage = () => {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [deleteUser, { isLoading: isDeleteUserLoading }] = useDeleteUserMutation();
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const deleteHandler = async (userId) => {
    try {
      const { data } = await deleteUser(userId);
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  // Filter users based on the search term
  const filteredUsers = users?.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      <Meta title={"User List"} />
      <h2 className="text-white">Users</h2>

      {isDeleteUserLoading && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <>
          {/* Search Input */}
          <Form.Group controlId="search" className="my-3">
            <Form.Control
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            />
          </Form.Group>

          {/* User Table */}
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
              {filteredUsers?.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <LinkContainer to={`/admin/user/update/${user._id}`}>
                      <Button className="btn-sm" variant="light">
                        <FaEdit />
                      </Button>
                    </LinkContainer>

                    <Button className="btn-sm" variant="light" onClick={() => deleteHandler(user._id)}>
                      <FaTrash style={{ color: "red" }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default UserListPage;
