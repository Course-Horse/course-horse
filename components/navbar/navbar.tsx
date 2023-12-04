import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import styles from "./navbar.module.scss";

export default function NavBar() {
  return (
    <Navbar expand="lg" className={`bg-body-tertiary ${styles.navbar}`}>
      <Container>
        <Navbar.Brand href="/">
          <img
            src="/favicon.ico"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Course Horse logo"
          />{" "}
          Course Horse
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className={`me-auto ${styles.navContainer}`}>
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            <Nav.Link href="/profile">My Profile</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
