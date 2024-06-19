import {io} from 'socket.io-client'

const isClient = typeof window === 'object'
const localInfo = isClient ? localStorage.getItem('etwl') : null
const token = localInfo ? JSON.parse(localInfo as string).token : null

export const socket = io(`${process.env.EXPO_PUBLIC_UPLOAD}`, {
  auth: {
    strategy: 'jwt',
    token 
  },
  query: {
    populate: {
      created_by_user: '*',
      comment_for: '*'
    }
  }
})

