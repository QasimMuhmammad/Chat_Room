import React from 'react';
import {
    Image,
    Menu
  } from 'semantic-ui-react'


// Component for header
class NavBar extends React.Component{

    render(){
       return ( 
            <Menu inverted color='grey' style={{margin:'0px',maxHeight: '10vh', height:'10vh'}}> 
                    <Menu.Item as='a' header style={{ fontSize: '15px'}}>
                        <Image size='tiny' src='/stock_overflow_image.png'/>
                        Stock Overflow
                        </Menu.Item>
                    <Menu.Item as='a'>Chat Room</Menu.Item>
                    <Menu.Item as='a' position='right'>Logged in as: </Menu.Item>
            </Menu>
       )
    }


} export default NavBar;