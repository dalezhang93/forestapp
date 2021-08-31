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
    url: `tree-2.json`
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

export function fireLine(params) {
  return request({
    url: `/api/fires/fireline`,
    method: 'GET',
    params
  })
}