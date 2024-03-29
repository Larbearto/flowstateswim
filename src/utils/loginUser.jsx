import { collection, getDocs, query, where } from 'firebase/firestore'
import db from '../firebase.config'
import CryptoJS from 'crypto-js'

export const LoginUser = async (payload) => {
  try {
    const qry = query(collection(db, 'users'), where('email', '==', payload.email))
    const userSnapshots = await getDocs(qry)
    if (userSnapshots.size === 0) {
      throw new Error('user does not exist')
    }
    const user = userSnapshots.docs[0].data()
    user.id = userSnapshots.docs[0].id
    const bytes = CryptoJS.AES.decrypt(user.password, 'flowstateswim-eb240')
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8)

    if (originalPassword !== payload.password) {
      throw new Error('Incorrect password')
    }

    return {
      success: true,
      message: 'User logged in successfully',
      data: user
    }
  } catch (error) {
    return error
  }
}
