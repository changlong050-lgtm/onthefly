import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import './CreateActivity.css'

const AddUserToTrip  = ({ API_URL }) => {
    const [username, setUsername] = useState({username: ''})
    const { trip_id } = useParams()
    
    const handleChange = (event) => {
        const {name, value} = event.target
        setUsername((prev) => {
            return {
                ...prev,
                [name]:value
            }
        })
    }

    const addUserToTrip = async (event) => {
        event.preventDefault()

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(username)
        }

        try {
            const response = await fetch(`${API_URL}/api/users-trips/create/${trip_id}`, options)
            if (!response.ok) {
                alert('Failed to add user')
                return
            }
            window.location.href = '/'
        } catch (err) {
            console.error('Error:', err)
            alert('Error adding user')
        }
        
        //window.location.href = '/'
    }
    return (
        <div>
            <center><h3>Add User to Trip</h3></center>
            <form>
                <label>Enter GitHub Username:</label><br />
                
                <input
                    type='text'
                    id='username'
                    name='username'
                    value={username.username}
                    onChange={handleChange}
                /><br />

                <label>Trip ID</label><br />
                <input type='number' id='trip_id' name='trip_id' value={trip_id} readOnly /><br />
                <br />

                <input type='submit' value='Submit' onClick={addUserToTrip}/>
            </form>
        </div>
    )

}

export default AddUserToTrip