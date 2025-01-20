class UnexpectedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UnexpectedError";
    }
}

export default UnexpectedError;