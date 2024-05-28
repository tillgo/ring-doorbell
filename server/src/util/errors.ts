/**
 * Custom error class for throwing expected errors with status codes.
 * If this error is thrown, the error handler middleware will catch it and send a response with the specified status code and message.
 *
 * @class ThrowableProblem
 * @extends {Error}
 * @param {string} message - The error message
 * @param {number} [status=500] - The HTTP status code
 */
export class ThrowableProblem extends Error {
    constructor(
        message: string,
        public status: number = 500
    ) {
        super(message)
        this.name = this.constructor.name
    }
}

export class BadRequestProblem extends ThrowableProblem {
    constructor(message: string) {
        super(message, 400)
    }
}

export class UnauthorizedProblem extends ThrowableProblem {
    constructor(message: string = 'Unauthorized access') {
        super(message, 401)
    }
}

export class ForbiddenProblem extends ThrowableProblem {
    constructor(message: string = 'Forbidden access') {
        super(message, 403)
    }
}
