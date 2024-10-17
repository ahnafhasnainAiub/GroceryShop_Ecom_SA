import React, { useEffect, useState } from "react";
import { Table, Button, Row, Col, Form } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { toast } from "react-toastify";
import { FaRupeeSign, FaTrash, FaEdit } from "react-icons/fa";
import { useGetProductsQuery } from "../../slices/productsApiSlice";
import { useDeleteProductMutation } from "../../slices/productsApiSlice";
import Loader from "../../components/Loader";
import Paginate from "../../components/Paginate";
import Message from "../../components/Message";
import Meta from "../../components/Meta";
import { addCurrency } from "../../utils/addCurrency";

const ProductListPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(8);
  const [skip, setSkip] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const { data, isLoading, error } = useGetProductsQuery({
    limit,
    skip,
  });

  const [deleteProduct, { isLoading: isDeleteProductLoading }] = useDeleteProductMutation();

  useEffect(() => {
    if (data) {
      setSkip((currentPage - 1) * limit);
      setTotal(data.total);
      setTotalPage(Math.ceil(total / limit));
    }
  }, [currentPage, data, limit, total]);

  // Filter products based on the search term
  const filteredProducts = data?.products?.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.category.toLowerCase().includes(searchTerm.toLowerCase()) || product.brand.toLowerCase().includes(searchTerm.toLowerCase()) || product._id.toLowerCase().includes(searchTerm.toLowerCase()));

  const deleteHandler = async (productId) => {
    try {
      const { data } = await deleteProduct(productId);
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const pageHandler = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPage && pageNum !== currentPage) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <Meta title={"Product List"} />
          <h1 className="text-white">Products</h1>
        </Col>
        <Col className="text-end">
          <LinkContainer to={"/admin/product/create"}>
            <Button className=" my-3" variant="warning">
              Add Product
            </Button>
          </LinkContainer>
        </Col>
      </Row>

      {/* Search Input */}
      <Row className="my-3">
        <Col>
          <Form.Control
            type="text"
            placeholder="Search by name, category, brand, or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          />
        </Col>
      </Row>

      {isDeleteProductLoading && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <Table striped hover bordered responsive size="sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>DISCOUNTED PRICE</th>
                <th>DISCOUNT</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>QTY</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts?.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{addCurrency(product.price)}</td>
                  <td>{addCurrency(product?.discountPrice)}</td>
                  <td>{product?.discountPrice ? Math.ceil(((product.price - product?.discountPrice) / product.price) * 100) : 0}%</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>{product.countInStock} KG</td>
                  <td>
                    <LinkContainer to={`/admin/product/update/${product._id}`}>
                      <Button className="btn-sm" variant="light">
                        <FaEdit />
                      </Button>
                    </LinkContainer>

                    <Button className="btn-sm" variant="light" onClick={() => deleteHandler(product._id)}>
                      <FaTrash style={{ color: "red" }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {totalPage > 1 && <Paginate currentPage={currentPage} totalPage={totalPage} pageHandler={pageHandler} />}
        </>
      )}
    </>
  );
};

export default ProductListPage;
