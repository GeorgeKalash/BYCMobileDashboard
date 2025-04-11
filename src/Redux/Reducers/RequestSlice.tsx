import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface RequestState {
  activeRequests: number
  loading: boolean
}

const initialState: RequestState = {
  activeRequests: 0,
  loading: false
}

const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    incrementRequests(state) {
      state.activeRequests++
      state.loading = true
    },
    decrementRequests(state) {
      state.activeRequests = Math.max(state.activeRequests - 1, 0)
      state.loading = state.activeRequests > 0
    }
  }
})

export const { incrementRequests, decrementRequests } = requestSlice.actions
export default requestSlice.reducer
