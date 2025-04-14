import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { RootState } from '../Store'
import { RequestProps } from '@/Types/RequestType'

export const getAccessToken = createAsyncThunk<string, void, { state: RootState }>(
  'auth/getAccessToken',
  async (_, { dispatch }) => {

    const user = JSON.parse(sessionStorage.getItem('userData') || 'null')   

    if (!user?.expiresAt) return user?.accessToken || ''

    const now = Math.floor(Date.now() / 1000)
    if (user.expiresAt > now) return user.accessToken

    const bodyFormData = new FormData()
    bodyFormData.append(
      'record',
      JSON.stringify({ accessToken: user.accessToken, refreshToken: user.refreshToken })
    )

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_AuthURL}MA.asmx/newAT`,
      bodyFormData,
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    const { accessToken, refreshToken } = response.data.record
    const expiresAt = jwtDecode(accessToken)

    dispatch({
      type: 'auth/updateUser',
      payload: { ...user, accessToken, refreshToken, expiresAt }
    })

    return accessToken
  }
)

export const getRequest = createAsyncThunk<any, RequestProps, { state: RootState }>(
  'request/getRequest',
  async (body, { getState, dispatch }) => {
    const { user } = getState().authSlice
    const token = await dispatch(getAccessToken()).unwrap()
    const apiUrl = window.localStorage.getItem('apiUrl') || ''
    const url = `${apiUrl}${body.extension}?${body.parameters}`
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          LanguageId: user?.languageId
        }
      })
      return response.data
    } catch (error) {
      if (body.throwError) throw error
      return error
    }
  }
)

export const postRequest = createAsyncThunk<any, RequestProps, { state: RootState }>(
  'request/postRequest',
  async (body, { getState, dispatch }) => {
    const { user } = getState().authSlice
    const token = await dispatch(getAccessToken()).unwrap()
    const apiUrl = window.localStorage.getItem('apiUrl') || ''
    const url = `${apiUrl}${body.extension}`

    const formData = new FormData()
    if (body.body) {
      formData.append('record', JSON.stringify(body.body))
    }

    try {
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          LanguageId: user?.languageId
        }
      })
      return response.data
    } catch (error) {
      if (body.throwError) throw error
      return error
    }
  }
)

