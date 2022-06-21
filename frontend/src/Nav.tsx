import React from 'react';
import { Container, Navbar, Nav as BSNav, Button } from 'react-bootstrap';
import PrefixLinkContainer from './PrefixLinkContainer';

import styles from './Nav.module.css';

const Nav: React.FC<{}> = () => {
  return (
    <Navbar className={styles.nav} bg="dark" variant="dark" expand="sm">
      <Container>
        <PrefixLinkContainer to="/streams">
          <Navbar.Brand>Twitch WildRP Only</Navbar.Brand>
        </PrefixLinkContainer>
        <Navbar.Toggle />
        <Navbar.Collapse className='justify-content-end justify-content-md-between'>
          <Button
            className={[styles.extension, 'd-none', 'd-md-block'].join(' ')}
            size='sm'
            href='https://chrome.google.com/webstore/detail/twitch-wildrp-only/jnbgafpjnfoocapahlkjihjecoaaaikd'
          >
            Get Extension
          </Button>
          <BSNav>
            <PrefixLinkContainer to="/streams">
              <BSNav.Link>Streams</BSNav.Link>
            </PrefixLinkContainer>
            <PrefixLinkContainer to="/characters">
              <BSNav.Link>Characters</BSNav.Link>
            </PrefixLinkContainer>
            <PrefixLinkContainer to="/multistream">
              <BSNav.Link>Multistream</BSNav.Link>
            </PrefixLinkContainer>
          </BSNav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Nav;
