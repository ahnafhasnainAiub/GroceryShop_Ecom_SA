import React, { useState, useMemo, useEffect } from "react";
import { Table, Button, Form, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaIndianRupeeSign, FaXmark } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";

import { useGetOrdersQuery } from "../../slices/ordersApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import Meta from "../../components/Meta";
import { useSelector } from "react-redux";
import { addCurrency } from "../../utils/addCurrency";
import Paginate from "../../components/Paginate"; 
import jsPDF from "jspdf";
import "jspdf-autotable";

const OrderListsPage = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const { userInfo } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [limit, setLimit] = useState(10); // Limit of items per page
  const [totalPage, setTotalPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    if (orders) {
      // Set totalPage based on number of filtered orders and limit per page
      const totalFilteredOrders = orders.filter((order) =>
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user._id.toLowerCase().includes(searchTerm.toLowerCase())
      ).length;
      setTotalPage(Math.ceil(totalFilteredOrders / limit));
    }
  }, [orders, searchTerm, limit]);

  // Compute top customers from orders
  const topCustomers = useMemo(() => {
    if (!orders) return [];

    const customerMap = {};

    orders.forEach((order) => {
      if (order.isPaid) {
        const userId = order.user._id;

        if (!customerMap[userId]) {
          customerMap[userId] = {
            name: order.user.name,
            totalSpent: 0,
            totalOrders: 0,
          };
        }

        customerMap[userId].totalSpent += order.totalPrice;
        customerMap[userId].totalOrders += 1;
      }
    });

    const customerArray = Object.values(customerMap);
    customerArray.sort((a, b) => b.totalSpent - a.totalSpent);

    return customerArray.slice(0, 3);
  }, [orders]);

  // Compute top products by quantity from orders
  const topProducts = useMemo(() => {
    if (!orders) return [];

    const productMap = {};

    orders.forEach((order) => {
      if (order.isPaid) {
        order.orderItems.forEach((item) => {
          const productId = item.product;

          if (!productMap[productId]) {
            productMap[productId] = {
              name: item.name,
              totalQty: 0,
              totalSales: 0,
            };
          }

          productMap[productId].totalQty += item.qty;
          productMap[productId].totalSales += item.price * item.qty;
        });
      }
    });

    const productArray = Object.values(productMap);
    productArray.sort((a, b) => b.totalQty - a.totalQty);

    return productArray.slice(0, 3);
  }, [orders]);

  // Function to generate PDF report of top customers and products
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add Top Customers Table
    doc.setFontSize(16);
    doc.text("Top Customers Report", 14, 15);
    doc.autoTable({
      startY: 20,
      head: [["#", "Customer Name", "Total Spent", "Orders Placed"]],
      body: topCustomers.map((customer, index) => [
        index + 1,
        customer.name,
        customer.totalOrders,
        `BDT ${customer.totalSpent}`,
      ]),
    });

    // Add some space before the next table
    let finalY = doc.lastAutoTable.finalY + 10;

    // Add Top Products Table
    doc.setFontSize(16);
    doc.text("Top Products Report", 14, finalY);
    doc.autoTable({
      startY: finalY + 5,
      head: [["#", "Product Name", "Quantity Sold", "Total Sales"]],
      body: topProducts.map((product, index) => [
        index + 1,
        product.name,
        product.totalQty,
        `BDT ${product.totalSales}`,
      ]),
    });

    // Save the PDF
    doc.save("My_Grocery_Shops_Top_Customers_And_Products_Report.pdf");
  };

  // Sort orders by createdAt in descending order (newest first)
  const sortedOrders = orders
    ? [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  // Filter orders based on search term
  const filteredOrders = sortedOrders.filter(
    (order) =>
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get orders for the current page
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  const pageHandler = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPage && pageNum !== currentPage) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <>
      <Meta title={"Order List"} />

      {/* Generate PDF Report Button */}
      <div className="d-flex justify-content-end mt-3">
        <Button variant="primary" onClick={generatePDF}>
          Download Report
        </Button>
      </div>

      {/* Top Customers and Top Products Section */}
      <Row className="d-flex justify-content-around my-4">
        {/* Top Customers Table */}
        <Col xs={12} md={6}>
          <h3 className="text-white">Top Customers</h3>
          <Table striped bordered hover responsive size="sm" className="mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer Name</th>
                <th>Orders Placed</th>
                <th>Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((customer, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{customer.name}</td>
                  <td>{customer.totalOrders}</td>
                  <td>{addCurrency(customer.totalSpent)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        {/* Top Products Table */}
        <Col xs={12} md={6}>
          <h3 className="text-white">Top Products</h3>

          <Table striped bordered hover responsive size="sm" className="mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>Quantity Sold</th>
                <th>Total Sales</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.totalQty}</td>
                  <td>{addCurrency(product.totalSales)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <div className="d-flex justify-content-between">
      <h1 className="text-white text-center">Orders</h1>
      <div className="d-flex justify-content-center mb-4">
        <LinkContainer to="/admin/sort-order">
          <Button variant="secondary">Monthly Report</Button>
        </LinkContainer>
      </div>

      </div>
      
      {/* Search Input */}
      <Form.Group controlId="search" className="my-3">
        <Form.Control
          type="text"
          placeholder="Search by user name or order ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
        />
      </Form.Group>

      {/* Orders Table */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Table striped hover bordered responsive size="sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders?.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user.name}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{addCurrency(order.totalPrice)}</td>
                  <td>
                    {order.isPaid ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaXmark style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaXmark style={{ color: "red" }} />
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

          {/* Pagination */}
          {totalPage > 1 && (
            <Paginate
              currentPage={currentPage}
              totalPage={totalPage}
              pageHandler={pageHandler}
            />
          )}
        </>
      )}
    </>
  );
};

export default OrderListsPage;
