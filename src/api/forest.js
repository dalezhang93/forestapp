/*
 * @Descripttion:
 * @Author: sandro0618
 * @Date: 2021-07-13 17:10:53
 * @LastEditors: sandro0618
 * @LastEditTime: 2021-08-03 09:46:48
 */
import request from '@/utils/request'


export function getAllFires(params) {
  return request({
    url: `/api/fires/allfires`,
    method: 'GET',
    params
  })
}

export function getAllFiresLocal() {
  return request({
    url: `tree-0.json`
  })
}

export function firesInit(data) {
  return request({
    url: `/api/fires/init`,
    method: 'POST',
    Headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    data
  })
}

export function nextFire(data) {
  return request({
    url: `/api/fires/nextFire`,
    method: 'POST',
    Headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    data
  })
}

export function nextFireLocal() {
  return request({
    url: `tree-5.json`
  })
}

export function startFire(data) {
  return request({
    url: `/api/fires/startfire`,
    method: 'POST',
    Headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    data
  })
}

export function resetFire(data) {
  return request({
    url: `/api/fires/resetFire`,
    method: 'POST',
    Headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    data
  })
}