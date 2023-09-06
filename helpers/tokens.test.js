const jwt = require("jsonwebtoken");
const { createToken } = require("./tokens.js");
const { SECRET_KEY } = require("../config");

// Mock the jwt.sign function to prevent actual token generation
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("createToken", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should generate a JWT token with the provided payload", () => {
    const user = { username: "testuser" };
    const expectedPayload = { username: "testuser" };

    // Mock the jwt.sign method to return a predefined token
    jwt.sign.mockReturnValue("mockedToken");

    const token = createToken(user);

    // Verify that jwt.sign was called with the expected payload and secret key
    expect(jwt.sign).toHaveBeenCalledWith(expectedPayload, SECRET_KEY);

    // Verify that the generated token matches the expected value
    expect(token).toBe("mockedToken");
  });
});