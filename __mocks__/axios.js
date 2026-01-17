const mockGet = jest.fn();
const mockPost = jest.fn();

const mockAxiosInstance = {
  get: mockGet,
  post: mockPost,
};

const mockAxios = {
  create: jest.fn(() => mockAxiosInstance),
  get: mockGet,
  post: mockPost,
};

module.exports = mockAxios;
module.exports.mockGet = mockGet;
module.exports.mockPost = mockPost;
