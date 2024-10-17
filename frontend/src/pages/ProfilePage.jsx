import React from "react";
import { Row, Col, Button, Table, Image } from "react-bootstrap";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";
import { LinkContainer } from "react-router-bootstrap";
import { FaIndianRupeeSign } from "react-icons/fa6";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";
import ProfileForm from "../components/ProfileForm";
import { addCurrency } from "../utils/addCurrency";
import axios from "axios";
import Swal from "sweetalert2";

const ProfilePage = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  const handleReturn = async (productId) => {
    try {
      const { data } = await axios.get(`/api/v1/orders/${productId}/return`);
      Swal.fire("Returned!", "Your order has been returned successfully.", "success");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      Swal.fire("Error!", error.response.data.message, "error");
    }
  };

  return (
    <>
      <Col>
        <Col>
          <Meta title={"User Profile"} />
          <h2>My Profile</h2>
          <Image style={{ maxWidth: 160, marginTop: 24, marginBottom: 24 }} src="https://cdn-icons-png.flaticon.com/512/219/219969.png" roundedCircle />
          <ProfileForm />
        </Col>
        <Col>
          <h2>My Orders</h2>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error?.data?.message || error.error}</Message>
          ) : (
            <Table striped hover responsive size="sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th>DETAILS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{addCurrency(order.totalPrice)}</td>
                    <td>{order.isPaid ? <FaCheck style={{ color: "green" }} /> : <FaXmark style={{ color: "red" }} />}</td>
                    <td>{order.isDelivered ? <FaCheck style={{ color: "green" }} /> : <FaXmark style={{ color: "red" }} />}</td>
                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button className="btn-sm" variant="info">
                          Details
                        </Button>
                      </LinkContainer>
                    </td>
                    <td>
                      {order.isReturned ? (
                        <p>Returned</p>
                      ) : (
                        <Button onClick={() => handleReturn(order._id)} className="btn-sm" variant="danger">
                          Return
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Col>
    </>
  );
};

export default ProfilePage;
