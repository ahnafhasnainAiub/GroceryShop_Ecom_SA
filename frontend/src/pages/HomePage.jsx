import React, { useEffect, useState } from "react";
import { Row, Col, Image, Card, Form, Button, Tabs, Tab } from "react-bootstrap";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import { useSelector } from "react-redux";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(0);
  const [skip, setSkip] = useState(0);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const { search } = useSelector((state) => state.search);
  const [key, setKey] = useState("Vegetable"); // State to control active tab

  const { data, isLoading, error } = useGetProductsQuery({
    limit,
    skip,
    search,
  });

  useEffect(() => {
    if (data) {
      const categories = [...new Set(data?.products?.map((product) => product.category))];
      setCategories(categories);
      setLimit(100);
      setSkip((currentPage - 1) * limit);
      setTotal(data.total);
      setTotalPage(Math.ceil(total / limit));
    }
  }, [currentPage, data, limit, total, search]);

  const pageHandler = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPage && pageNum !== currentPage) {
      setCurrentPage(pageNum);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <Meta />

          {!search && (
            <Row
              className="mb-5 align-items-center px-5"
              style={{
                position: "relative",
                backgroundImage: `url('https://images.unsplash.com/photo-1568724001336-2101ca2a0d8b?q=80&w=1982&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                padding: "50px 0",
                color: "#fff",
              }}>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  zIndex: 1,
                }}
              />
              <Col md={6} style={{ zIndex: 1, paddingRight: "4rem" }}>
                <h1>Welcome to Our Store</h1>
                <p>Discover the best products at unbeatable prices. Our store offers a wide range of high-quality items to meet all your needs. Shop now and experience exceptional value and service.</p>
              </Col>
              <Col md={6} style={{ zIndex: 1 }}>
                <ProductCarousel />
              </Col>
            </Row>
          )} 

          {search && (
            <>
              <div className="d-flex justify-content-between">
                <h3 className="mt-5">Search Result for {search}</h3>
                <h6 className="mt-5">{data.products.length} items</h6>
              </div>

              {data.products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              ))}
            </>
          )} 

          <Tabs hidden={search} id="product-categories" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
            {categories.map((cat, i) => (
              <Tab key={i} eventKey={cat} title={cat}>
                <Row>
                  {data.products
                    .filter((product) => product.category === cat)
                    .map((product) => (
                      <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                        <Product product={product} />
                      </Col>
                    ))}
                </Row>
              </Tab>
            ))}
          </Tabs>

          {/* Testimonial Section */}
          <Row className="mt-5">
            <Col>
              <h2 className="text-center mb-4">What Our Customers Say</h2>
              <Row>
                <Col md={4}>
                  <Card className="text-center p-3">
                    <Card.Body>
                      <Card.Text>"Amazing products and fantastic service! I'm so happy with my purchase and will definitely be back."</Card.Text>
                      <Card.Footer className="text-muted">Jane Doe</Card.Footer>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="text-center p-3">
                    <Card.Body>
                      <Card.Text>"The quality of the items is top-notch. Shipping was fast and customer support was very helpful."</Card.Text>
                      <Card.Footer className="text-muted">John Smith</Card.Footer>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="text-center p-3">
                    <Card.Body>
                      <Card.Text>"I had a great shopping experience. The products are exactly as described and the prices are great."</Card.Text>
                      <Card.Footer className="text-muted">Emily Johnson</Card.Footer>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Contact Us Section */}
          <Row className="mt-5">
            <Col md={6}>
              <h2 className="text-center mb-4">Contact Us</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="formSubject">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control type="text" name="subject" value={formData.subject} onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="formMessage">
                  <Form.Label>Message</Form.Label>
                  <Form.Control as="textarea" rows={4} name="message" value={formData.message} onChange={handleChange} required />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                  Send Message
                </Button>
              </Form>
            </Col>
            <Col md={6}>
              <Image src="https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Contact Us" fluid />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default HomePage;
