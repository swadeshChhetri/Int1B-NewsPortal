export function success(data = null, message = 'OK') {
  return { success: true, message, data };
}

export function error(message = 'Error', data = null) {
  return { success: false, message, data };
}
