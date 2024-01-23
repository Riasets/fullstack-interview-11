import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as dotenv from 'dotenv'
import axios from 'axios'
import { DataTypes, Model, QueryTypes, Sequelize } from 'sequelize'
import * as Redis from 'redis'

dotenv.config({
  path: '../../.env',
})

const config = {
  server: {
    host: process.env.BACKEND_HOST,
    port: +process.env.BACKEND_PORT,
  },
  mysql: {
    host: process.env.MYSQL_HOST,
    port: +process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  },
  redis: {
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DATABASE}`,
  },
  prospect: {
    baseUrl: process.env.PROSPECT_BASE_URL,
    apiKey: process.env.PROSPECT_API_KEY,
  },
}

const sequelize = new Sequelize({
  dialect: 'mysql',
  ...config.mysql,
})

class DomainModel extends Model {
  declare id: number
  declare domain: string
  declare is_dns_valid: boolean
  declare is_dns_valid_mx: boolean
  declare is_private_mail: boolean
  declare is_free_mail: boolean
  declare is_disposable_mail: boolean
  declare is_smtp_valid: boolean
  declare is_smtp_catch_all: boolean
  declare is_banned: boolean
}

DomainModel.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  domain:  DataTypes.STRING,
  is_dns_valid: DataTypes.BOOLEAN,
  is_dns_valid_mx: DataTypes.BOOLEAN,
  is_private_mail: DataTypes.BOOLEAN,
  is_free_mail: DataTypes.BOOLEAN,
  is_disposable_mail: DataTypes.BOOLEAN,
  is_smtp_valid: DataTypes.BOOLEAN,
  is_smtp_catch_all: DataTypes.BOOLEAN,
  is_banned: DataTypes.BOOLEAN,
}, {
  sequelize,
  tableName: 'domain',
  timestamps: false,
})

class EmailModel extends Model {
  id: number
  domain_id: number
  email: string
  verification_result: string
  is_private: boolean
  last_verified_at: Date
  created_at: Date
}

EmailModel.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  domain_id: DataTypes.BIGINT.UNSIGNED,
  email: DataTypes.STRING,
  verification_result: DataTypes.STRING,
  is_private: DataTypes.BOOLEAN,
  last_verified_at: DataTypes.DATE,
  created_at: DataTypes.DATE,
}, {
  sequelize,
  tableName: 'email',
  timestamps: false,
})

const redis = Redis.createClient({
  url: config.redis.url,
})

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get('/', async (req, res) => {
  try {
    const mysqlTest = await sequelize.query('show tables', {
      type: QueryTypes.SELECT,
    })
    console.log('mysql test', mysqlTest)

    const redisTest = await redis.info('server')
    console.log('redis test', redisTest)

    res.send({ status: 'healthy' })
  } catch (e) {
    console.error(e)
    res.status(500).send({ error: e.message })
  }
})

app.get('/emails', async (req, res) => {
  try {
    const sql = `
      SELECT domain.*, email.*
      FROM email
      JOIN domain ON email.domain_id = domain.id
      ORDER BY email.last_verified_at`

    const rows = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    })

    res.send(rows);
  } catch (e) {
    console.error(e)
    res.status(500).send({ error: e.message })
  }
})

app.post('/verify', async (req, res) => {
  try {
    const email = req.body.email
    const domain = email.split('@')[1]

    const evResponse = await axios.post(
      config.prospect.baseUrl + '/api/v1/email-verifier',
      {email: [email]},
      {headers: {'Authorization': 'Bearer ' + config.prospect.apiKey}}
    )
    const evResult = evResponse.data['result'][0]

    const [domainModel] = await DomainModel.findOrCreate({
      where: {
        domain,
      }
    })

    await EmailModel.findOrCreate({
      where: {
        email,
      },
      defaults: {
        domain_id: domainModel.id,
        verification_result: evResult['result'],
        last_verified_at: new Date(),
        created_at: new Date(),
      },
    })

    // random delay

    res.send(evResult)
  } catch (e) {
    console.error(e)
    res.status(500).send({ error: e.message })
  }
})

async function bootstrap() {
  try {
    await redis.connect()
  } catch (e) {
    console.error(e)
  }
}

bootstrap().then(() => {
  app.listen(config.server.port, config.server.host, () => {
    console.log(`App server now listening on http://${config.server.host}:${config.server.port}`)
  })
})

process.on('SIGTERM', () => {
  process.exit(0)
})
