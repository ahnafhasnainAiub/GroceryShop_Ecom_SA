import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Badge, NavDropdown, Row, Col } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { toast } from "react-toastify";
import SearchBox from "./SearchBox";

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        localStorage.removeItem("userInfo");
      }
      await logoutApiCall().unwrap();
      dispatch(logout());

      navigate("/login");
      toast.success("Logout successful");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect className="fixed-top z-2 ">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>MyGrocery</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="w-100 justify-content-between">
            <div className="d-none d-md-block w-50 mx-auto">
              <SearchBox />
            </div>
            <Nav className="ms-auto m-2">
              <LinkContainer to="/cart">
                <Nav.Link>
                  <FaShoppingCart style={{ marginRight: "5px" }} />
                  Cart
                  {cartItems.length > 0 && (
                    <Badge pill bg="warning" style={{ marginLeft: "5px" }} className="text-dark">
                      <strong>{cartItems.reduce((acc, item) => acc + item.qty, 0)}</strong>
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title={`Hello👋, ${userInfo.name}`} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <FaUser style={{ marginRight: "5px" }} />
                    Log In
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu">
                  <LinkContainer to="/admin/product-list">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/order-list">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/user-list">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
