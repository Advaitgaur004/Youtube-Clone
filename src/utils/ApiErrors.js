class Apierror extends Error {
  constructor(status, message,errors = [], stack = null) {
    super(message)
    this.status = status
    this.message = message
    this.errors = errors
    this.stack = stack
    this.success = false
  }
}