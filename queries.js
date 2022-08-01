const { Client, Pool } = require('pg')
const path = require('node:path')

var sslrootcert = path.dirname('./cert/ca.crt')
var sslcert = path.dirname('./cert/client.devincloud.crt')
var sslkey = path.dirname('./cert/client.devincloud.key')
var connectString = `postgres://devincloud@10.11.121.69:2101/tbb_db?sslmode=require&sslrootcert=${sslrootcert}/ca.crt&sslcert=${sslcert}/client.devincloud.crt&sslkey=${sslkey}/client.devincloud.key`

// console.log({ sslrootcert, sslcert, sslkey, connectString })

const config = {
    connectionString: connectString,
}

const client = new Client(config)
client.connect(err => {
    if (err) {
        console.error('error connecting', err.stack)
    } else {
        // console.log(client)
        client.end()
    }
})

const pool = new Pool(config)
pool.connect()
    .then(client => {
        client.release()
    })
    .catch(err => console.error('error connecting', err.stack))
    // .then(() => pool.end())

const getCode = (req, res) => {
    pool.query('SELECT * FROM tbb_db.vip_reward_code', (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

const getCodeById = (req, res) => {
    const partner_code_id = parseInt(req.params.partner_code_id)
    pool.query('SELECT * FROM tbb_db.vip_reward_code WHERE partner_code_id = $1', [partner_code_id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

const createCode = (req, res) => {
    const { email, firstname } = req.body
    pool.query('INSERT INTO tbb_db.tbl_test (email, firstname) VALUES ($1, $2) RETURNING *', [email, firstname], (error, results) => {
        if (error) {
            throw error
        }
        res.status(201).send(`User added with email: ${results.rows[0].email}`)
    })
}

const updateCode = (req, res) => {
    const id = req.params.email
    const { email, firstname } = req.body
    pool.query(
        'UPDATE tbb_db.tbl_test SET email = $1, firstname = $2 WHERE email = $3', [email, firstname, id],
        (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send(`User modified with email: ${req.body.email}`)
        }
    )
}

const deleteCode = (req, res) => {
    const id = req.params.email
    pool.query('DELETE FROM tbb_db.tbl_test WHERE email = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).send(`User deleted with email: ${id}`)
    })
}

module.exports = {
    getCode,
    getCodeById,
    createCode,
    updateCode,
    deleteCode
}