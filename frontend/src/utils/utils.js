import axios from 'axios'

export const HOST_URL = 'http://localhost:4000'

export const http = () => {
  return axios.create({
    baseURL: HOST_URL,
    headers: {
      'Content-Type': 'application/json',
    }
  })
}


export const getMetrics = async (credentials) => {
    return (await http().get('/api/v1/metrics', {
        params: credentials
    })).data
}

export const addMetric = async (credentials) => {
  return (await http().post('/api/v1/metrics', credentials)).data
}