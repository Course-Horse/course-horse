import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import styles from "./navbar.module.scss";

export default function NavBar({ username }: { username: any }) {
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
          {username ? (
            <Nav className={`me-auto ${styles.navContainer}`}>
              <Nav.Link href="/courses/create">Create Course</Nav.Link>
              <Nav.Link href="/courses">Courses</Nav.Link>
              <Nav.Link href="/profile">My Profile</Nav.Link>
            </Nav>
          ) : (
            <Nav className={`me-auto ${styles.navContainer}`}>
              <Nav.Link href={"/signup"}>Sign Up</Nav.Link>
              <Nav.Link href={"/signin"}>Sign In</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
