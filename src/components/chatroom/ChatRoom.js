import React from 'react';
import io from "socket.io-client"
import { loadInitialDataSocket , update} from '../../actions';
import {connect} from 'react-redux'
import {
    Header,
    Icon,
    Input,
    Grid,
    Segment
  } from 'semantic-ui-react'
import Emoji from "react-emoji-render";



let socket

const mapStateToProps = (state) => {
	console.log('In map state to props', state)
    return {...state};
};


// Component for header
class ChatRoom extends React.Component{
    constructor(props)
   {
	   super(props)
	   const {dispatch} = this.props
    
	   socket = io.connect("http://localhost:3000")
       console.dir(socket)
       dispatch(loadInitialDataSocket(socket))
	   
	   socket.on('update',(data)=>{
		   console.log('Retrieved update', data)
		   dispatch(update(data))
	   })
   }

   componentWillUnmount() {
        socket.emit('disconnect-user', this.props.data.username)
    }
    
    componentDidUpdate() {
        // I was not using an li but may work to keep your div scrolled to the bottom as li's are getting pushed to the div
        const objDiv = document.getElementById('scrolling');
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    handleClick = () => {
        let messageObj = {content: this.state.userMessage, user:this.props.data.username.user, color:this.props.data.username.color}
        console.log('Sending',messageObj);
        // Check if it is change username or change color, if so send appropriate message to server



        socket.emit('send-message',messageObj);
      };

    handleMessageChange = (e) =>{
        this.setState({ userMessage: e.target.value });
    }

   createOnlineList(){
        if(this.props.data.usersOnline === undefined) return;

       return(
        this.props.data.usersOnline.map( (userObj,ind) =>{
            return(
                <Segment key={'online'+ind}>
                    <Header as='h3'>
                        <Icon size='massive' name='user circle outline' />
                        <Header.Content>{userObj}</Header.Content>
                    </Header>
                </Segment>
            )
        })
       )
   }

// Messages are formatted as { content:, user:, userColor:, timeStamp }   
   createMessageList(){
    if(this.props.data.chatLog === undefined) return;
    return(
        this.props.data.chatLog.map( (message,ind) =>{
            let textColor = '#'+message.color
            console.log('Color for text is:', textColor)
            
            if(message.user !== this.props.data.username.user)
            {    return(
                    <Segment key={'message'+ind}>
                        <Header as='h3' textAlign='left' style={{marginBottom: '10px', marginLeft:'-5px'}}>
                            <Icon size='massive' name='user circle outline' />
                            <Header.Content style={{color:textColor}} content={message.user}/>
                        </Header>
                        <div>   
                                <Emoji style={{color:textColor}} text = {message.content}/>
                                <p style={{marginBottom: '-10px',marginTop: '10px'}}><i>{message.timeStamp}</i></p>
                        </div>
                    </Segment>
                )
            } else{
                return(
                    <Segment key={'message'+ind} style={{backgroundColor:'#eeeeee'}}> 
                        <Header style={{textAlign: '-webkit-right', marginBottom: '10px', marginRight:'-5px'}} as='h3' >
                            <Icon style={{float:'right'}} size='massive' name='user circle outline' />
                            <Header.Content style={{color:textColor, textAlign:'right', margin:'7px;'}} content={message.user} />
                        </Header>
                        <div style={{textAlign:'right'}}>   
                                <Emoji style={{color:textColor,fontWeight: 'bold'}} text = {message.content} />
                                <p style={{marginBottom: '-10px',marginTop: '10px'}}><i>{message.timeStamp}</i></p>
                        </div>
                    </Segment>
                )
            }
        })
    )
    }

    getUser(){
        if(this.props.data.username === null){
            return 'Loading'
        }
        return this.props.data.username.user
    }

    render(){
       return (
        <div className='ui container center aligned' style={{width:'960px'}}> 
        <Grid centered celled='internally' style={{margin:'0px', backgroundColor:'#eeeeee', maxWidth:'960px'}} >
        {/* Top Row */}
            <Grid.Row >
                <Grid.Column  width={4}>
                        <Header size="large" textAlign="center" style={{margin:'0px'}}>Online Users</Header>
                </Grid.Column>
                <Grid.Column  width={12}>
                <Header as='h2'>
                    <Icon size='large' name='user circle outline' />
                    <Header.Content>{this.getUser()}</Header.Content>
                </Header>
                </Grid.Column>
            </Grid.Row>
        {/* Bottom row  */}
            <Grid.Row stretched  style={{backgroundColor:'inherit'}}> 
            <Grid.Column  width={4} stretched>
                <Segment.Group compact style={{overflow:'auto', maxHeight:'80vh', height:'80vh'}}>  
                    {this.createOnlineList()}
                </Segment.Group>
            </Grid.Column>
            <Grid.Column  width={12} stretched>
            <Segment.Group style={{}}>
                <Segment.Group id='scrolling' style={{overflow:'auto', maxHeight: '71vh', margin:'0px', height:'71vh'}}>
                    {this.createMessageList()}
                </Segment.Group>
                <Segment style={{maxHeight: '9vh', height:'9vh'}}>
                        <Input fluid placeholder='Enter a message for discussion...' onChange={this.handleMessageChange} action={{content:'Enter', onClick: (e) => this.handleClick()}}/>
                </Segment>
            </Segment.Group>
            </Grid.Column>
            </Grid.Row>
        </Grid>
        </div>
       )
    }


}export default  connect(mapStateToProps)(ChatRoom);