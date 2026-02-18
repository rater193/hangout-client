# DM Relay Server Documentation

## Overview
The DM Relay Server is designed to facilitate communication between clients in the hangout-client application. It acts as an intermediary to manage messages and WebSocket connections efficiently.

## Installation Instructions
1. **Clone the Repository**:  
   Run the following command to clone the repository:
   ```bash
   git clone https://github.com/rater193/hangout-client.git
   ```

2. **Install Dependencies**:  
   Navigate to the project directory and install the necessary dependencies:
   ```bash
   cd hangout-client
   npm install
   ```

3. **Configuration**:  
   Modify the configuration file to set up environment variables according to your development environment.

4. **Run the Server**:  
   Start the server with:
   ```bash
   npm start
   ```

## API Endpoints
### 1. **GET /api/messages**
   - Fetch a list of messages.
   - **Response:** List of messages.

### 2. **POST /api/messages**
   - Send a new message.
   - **Body:**  
   ```json
   {
       "senderId": "string",
       "recipientId": "string",
       "content": "string"
   }
   ```
   - **Response:** Confirmation of message sent.

### 3. **GET /api/conversations**
   - Retrieve ongoing conversations.
   - **Response:** List of conversations.

## WebSocket Events
- **connection**: Fired when a client connects to the server.
- **message**: Fired when a message is sent from a client.
- **disconnect**: Fired when a client disconnects.

## Integration Guide
1. **WebSocket Client Setup**:
   To connect to the DM Relay Server, initialize a WebSocket client:
   ```javascript
   const socket = new WebSocket('ws://localhost:3000');
   ```

2. **Listening to Events**:  
   ```javascript
   socket.onmessage = (event) => {
       const message = JSON.parse(event.data);
       console.log('Message received:', message);
   };
   ```

3. **Sending Messages**:
   ```javascript
   const message = {
       senderId: 'user123',
       recipientId: 'user456',
       content: 'Hello!'
   };

   socket.send(JSON.stringify(message));
   ```

## Conclusion
This documentation covers the basic setup and operation of the DM Relay Server. Ensure to follow the instructions carefully to integrate and start using the server in your application.