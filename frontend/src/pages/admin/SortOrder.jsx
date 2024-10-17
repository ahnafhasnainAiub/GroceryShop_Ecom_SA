// src/pages/admin/Sortorder.jsx

import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Form, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaCheck, FaTimes, FaChartLine } from "react-icons/fa"; // Updated import
import { useGetOrdersQuery } from "../../slices/ordersApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import Meta from "../../components/Meta";
import { useSelector } from "react-redux";
import { addCurrency } from "../../utils/addCurrency";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Sortorder = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const { userInfo } = useSelector((state) => state.auth);

  const [selectedMonth, setSelectedMonth] = useState("All"); // Selected month

  // Filter orders based on selected month and sort by newest first
  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    const sorted = [...orders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return selectedMonth === "All"
      ? sorted
      : sorted.filter((order) => {
          const orderMonth = new Date(order.createdAt).getMonth() + 1; // Months are 0-indexed
          return orderMonth === parseInt(selectedMonth);
        });
  }, [orders, selectedMonth]);

  // Function to generate PDF report of filtered orders
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Orders Report", 14, 20);

    doc.autoTable({
      startY: 30,
      head: [["#", "Order ID", "User", "Date", "Total", "Paid", "Delivered"]],
      body: filteredOrders.map((order, index) => [
        index + 1, // Serial number
        order._id,
        order.user.name,
        new Date(order.createdAt).toLocaleDateString(),
        order.totalPrice,
        order.isPaid ? "Yes" : "No",
        order.isDelivered ? "Yes" : "No",
      ]),
    });

    doc.save("Orders_Report.pdf");
  };

  // Months for the dropdown
  const months = [
    { name: "All -- (Select By Month)", value: "All" },
    { name: "January", value: "1" },
    { name: "February", value: "2" },
    { name: "March", value: "3" },
    { name: "April", value: "4" },
    { name: "May", value: "5" },
    { name: "June", value: "6" },
    { name: "July", value: "7" },
    { name: "August", value: "8" },
    { name: "September", value: "9" },
    { name: "October", value: "10" },
    { name: "November", value: "11" },
    { name: "December", value: "12" },
  ];

  return (
    <>
      <Meta title="Sort Orders by Month" />

      <h1 className="text-white text-center">Monthly Order Report</h1>

      {/* Sort Dropdown and PDF Button */}
      <Row className="d-flex justify-content-between align-items-center my-3">
        <Col xs={12} md={6}>
          <Form.Group controlId="monthSelect">
            <Form.Label>Select Month</Form.Label>
            <Form.Control
              as="select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>

        <Col xs={12} md={6} className="d-flex justify-content-end">
          <Button variant="primary" onClick={generatePDF}>
            Download Report
          </Button>
        </Col>
      </Row>

      {/* Orders Table */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Table striped bordered hover responsive size="sm" className="mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>User</th>
                <th>Date</th>
                <th>Total BDT</th>
                <th>Paid</th>
                <th>Delivered</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr key={order._id}>
                  <td>{index + 1}</td>
                  <td>{order._id}</td>
                  <td>{order.user.name}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{addCurrency(order.totalPrice)}</td>
                  <td>
                    {order.isPaid ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    <LinkContainer
                      to={
                        userInfo.isAdmin
                          ? `/admin/order/${order._id}`
                          : `/order/${order._id}`
                      }
                    >
                      <Button className="btn-sm" variant="info">
                        Details
                      </Button>
                    </LinkContainer>
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

export default Sortorder;
