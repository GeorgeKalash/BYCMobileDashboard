import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import SHA1 from 'crypto-js/sha1'

interface User {
  accountId: string
  userId: string
  username: string
  languageId: number
  userType: string
  employeeId: string
  fullName: string
  dashboardId: string
  role: string
  accessToken: string
  refreshToken: string
}

interface AuthState {
  user: User | null
  loading: boolean
  companyName: string
  getAC: any
  languageId: number
  apiUrl: string
  errorMessage?: string
}

const initialState: AuthState = {
  user: null,
  loading: true,
  companyName: '',
  getAC: {},
  languageId: 1,
  apiUrl: '',
  errorMessage: ''
}

const encryptePWD = (pwd: string): string => {
  const encryptedPWD = SHA1(pwd).toString()
  let shuffledString = ''
  for (let i = 0; i < encryptedPWD.length; i += 8) {
    const sub = encryptedPWD.slice(i, i + 8)
    shuffledString += sub.charAt(6) + sub.charAt(7)
    shuffledString += sub.charAt(4) + sub.charAt(5)
    shuffledString += sub.charAt(2) + sub.charAt(3)
    shuffledString += sub.charAt(0) + sub.charAt(1)
  }
  return shuffledString.toUpperCase()
}

export const fetchAC = createAsyncThunk('auth/fetchAC', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_AuthURL}/MA.asmx/getAC?_accountName=BYC-deploy`)
    window.localStorage.setItem('apiUrl', response.data.record.api)
    return response.data.record
  } catch (err) {
    return rejectWithValue('Failed to fetch AC')
  }
})

export const login = createAsyncThunk(
  'auth/login',
  async (
    {
      username,
      password,
      onError,
    }: { username: string; password: string; onError?: () => void },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { authSlice: AuthState }
      const getAC = state.authSlice.getAC

      const getUS2 = await axios.get(`${getAC.api}/SY.asmx/getUS2?_email=${username}`, {
        headers: {
          accountId: JSON.parse(getAC.accountId),
          dbe: JSON.parse(getAC.dbe),
          dbs: JSON.parse(getAC.dbs)
        }
      })

      if (!getUS2.data.record) {
        return rejectWithValue('User not found')
      }

      const signIn3Params = `_email=${username}&_password=${encryptePWD(password)}&_accountId=${getAC.accountId}&_userId=${getUS2.data.record.recordId}`

      const signIn3 = await axios.get(`${process.env.NEXT_PUBLIC_AuthURL}/MA.asmx/signIn3?${signIn3Params}`, {
        headers: {
          accountId: JSON.parse(getAC.accountId),
          dbe: JSON.parse(getAC.dbe),
          dbs: JSON.parse(getAC.dbs)
        }
      })

      if (!signIn3.data.record) {
        return rejectWithValue(signIn3.data.message || 'Login failed')
      }

      const accessToken = signIn3.data.record.accessToken

      const user: User = {
        accountId: getAC.accountId,
        userId: getUS2.data.record.recordId,
        username: getUS2.data.record.username,
        languageId: getUS2.data.record.languageId,
        userType: getUS2.data.record.userType,
        employeeId: getUS2.data.record.employeeId,
        fullName: getUS2.data.record.fullName,
        dashboardId: getUS2.data.record.dashboardId,
        role: 'admin',
        accessToken,
        refreshToken: signIn3.data.record.refreshToken
      }

      window.sessionStorage.setItem('userData', JSON.stringify(user))
      window.localStorage.setItem('languageId', String(user.languageId))
      document.cookie = `access_token=${user.accessToken}; path=/;`

      return user
    } catch (err: any) {
      onError?.()
      return rejectWithValue(err?.response?.data?.error || 'Login failed')
    }
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      window.localStorage.removeItem('userData')
      window.sessionStorage.removeItem('userData')
      document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
    },
    setLanguageId(state, action: PayloadAction<number>) {
      state.languageId = action.payload
      window.localStorage.setItem('languageId', String(action.payload))
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAC.pending, state => {
        state.loading = true
      })
      .addCase(fetchAC.fulfilled, (state, action) => {
        state.getAC = action.payload
        state.companyName = action.payload.companyName
        state.apiUrl = action.payload.api
        state.loading = false
      })
      .addCase(fetchAC.rejected, state => {
        state.loading = false
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload
        state.languageId = action.payload.languageId
        state.errorMessage = ''
        state.loading = false
      })
      .addCase(login.rejected, (state, action) => {
        state.errorMessage = action.payload as string
        state.loading = false
      })
  }
})

export const { logout, setLanguageId } = authSlice.actions
export default authSlice.reducer
