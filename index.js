
import express from 'express'

const app = express()
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Hello ImpactNest Community Member!')
})

app.listen(port, () => {
  console.log(`ImpactNest Community server is running on port ${port}`)
})