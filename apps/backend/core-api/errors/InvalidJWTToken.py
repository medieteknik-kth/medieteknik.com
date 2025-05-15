class InvalidJWTTokenException(Exception):
    """
    Exception raised for invalid JWT tokens.
    """

    def __init__(self, message="Invalid JWT token."):
        self.message = message
        super().__init__(self.message)
