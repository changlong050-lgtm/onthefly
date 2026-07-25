// we'll set up routes for user trip interactions
// These interactions will include creating a trip, viewing all user associated with a particular trip
// 和用户相关的，就是 看一个用户的所有trips
// 看 和一个trip相关的所有user

import { pool } from '../config/database.js'



export const createTripUser = async (req, res) => {
    try {
        const trip_id = parseInt(req.params.trip_id)
        const { username } = req.body

        const userResult = await pool.query(
            'SELECT id FROM users WHERE username = $1',
            [username]
        )

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' })
        }

        const user_id = userResult.rows[0].id

        const results = await pool.query(`
            INSERT INTO trips_users (trip_id, user_id)
            VALUES($1, $2)
            RETURNING *`,
            [trip_id, user_id]
        )

        res.status(200).json(results.rows[0])

        console.log('🆕 added user to trip')
    }

    catch (error) {
        res.status(409).json( { error: error.message } )
        console.log('Error:', error.message)
    }
}

export const getTripUsers = async (req, res) => {
    try {
        const trip_id = parseInt(req.params.trip_id)
        const results = await pool.query(`
            SELECT u.* FROM trips_users tu
            JOIN users u ON tu.user_id = u.id
            WHERE tu.trip_id = $1`,
            [trip_id]
        )
        res.status(200).json(results.rows)
    } catch (error) {
        res.status(409).json( { error: error.message } )
        console.log('🚫 unable to GET all users (travelers) - Error:', error.message)
    }
}

export const getUserTrips = async (req, res) => {
    try {
        const user_id = parseInt(req.params.user_id)
        const results = await pool.query(`
            SELECT t.* FROM trips_users tu
            JOIN trips t ON tu.trip_id = t.id
            WHERE tu.user_id = $1`,
            [user_id]
        )

        res.status(200).json(results.rows)
    } catch (error) {
        res.status(409).json( { error: error.message } )
        console.log('🚫 unable to GET users trips = Error:', error.message)
    }
}