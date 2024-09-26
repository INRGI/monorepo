import axios from 'axios';

const mockDataResponse = [
  { health: 50, id: 1, name: 'Goblin' },
  { health: 100, id: 2, name: 'Troll' },
  { health: 200, id: 3, name: 'Berserk' },
  { health: 300, id: 4, name: 'Demon' },
  { health: 400, id: 5, name: 'Vampire' },
  { health: 500, id: 6, name: 'Dragon' },
];

const mockUser = {
  email: 'test@test.com',
  password: 'testtest',
};

const mockUsersService = {
  create: jest.fn().mockResolvedValue(mockUser),
  findOneByEmail: jest.fn().mockResolvedValue(undefined),
};

describe('GET /battle/monsters', () => {
  it('should return a array of monsters', async () => {
    const res = await axios.get(`/battle/monsters`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual(mockDataResponse);
  });
});

describe('POST /battle/attack', () => {
  it('should return a new object of monster', async () => {
    const res = await axios.post('/battle/attack', {
      character: { attack: 10 },
      monster: { id: 2, name: 'Goblin', health: 100 },
    });

    expect(res.status).toBe(201);
    expect(res.data).toEqual({
      monster: { id: 2, name: 'Goblin', health: 90 },
    });
  });
});

// describe('POST /register', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should register user and return user object', async () => {
//     const res = await axios.post('/auth/register', mockUser);

//     expect(res.status).toBe(201);
//     expect(res.data).toEqual(mockUser);
//     expect(mockUsersService.create).toHaveBeenCalledWith(
//       mockUser.email,
//       mockUser.password
//     );
//   });

//   it('should return an error if the user already exists', async () => {
//   });
// });

describe('POST /login', () => {
  it('should login user and return access token', async () => {
    const res = await axios.post('/auth/login', mockUser);

    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty('access_token');
  });
});

describe('POST /profile', () => {
  it('should return user', async () => {
    const res = await axios.post('/auth/profile', {email: 'test@test.com'});

    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty('access_token');
  });
})
