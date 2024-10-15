import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './app.module';

describe('App (e2e)', () => {
  let app: INestApplication;

  const mockedHero = {
    _id: '6706a007146bb8469d1bc0d4',
    name: 'test8@t.com',
    imageUrl:
      'https://img.freepik.com/premium-photo/pixel-art-knight-character-rpg-game-character-retro-style-8-bit-game-ai_985124-1868.jpg',
    level: 8,
    attack: 45,
    health: 170,
    experience: 300,
    coins: 553825,
    __v: 0,
  };

  const mockedMonster = {
    id: 1,
    name: 'Goblin',
    health: 50,
    attack: 10,
    imageUrl: 'https://pics.craiyon.com/2023-11-13/oxloxNSzQDWXIc7Hw3cqhA.webp',
    xp: 50,
  };

  const mockedItem = {
    uniqueId: 'afsgsgwegeag12r3fqw',

    name: 'DAGGER',

    type: 'weapon',

    rarity: 'epic',

    image: 'https://pics.craiyon.com/2023-12-07/Vo_N8o78QyCYpSwu4ME6QA.webp',

    stats: { attack: 100 },

    itemBox: 'EPIC',
  };

  const mockedItemBox = {
    name: 'Equal Chances',
    image:
      'https://media.istockphoto.com/id/1227145901/photo/fantasy-loot-box-futuristic-mystery-case.jpg?s=612x612&w=0&k=20&c=ySGLSNrYgPs3udg4r6cRTzRFWq53mjy_08W276SFIBs=',
    cost: 1200,
    chances: {
      common: 25,
      rare: 25,
      epic: 25,
      legendary: 25,
    },
  };

  const mockedEnchant = {
    name: 'luck',
    typeFor: 'weapon',
    enchantment: 'damage',
    percentageIncrease: 40,
    chances: 1,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

    describe('GameModule', () => {
      it('/GET battle/monsters', async () => {
        return await request(app.getHttpServer())
          .get('/battle/monsters')
          .expect(200)
          .expect((res) => {
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body.length).toBeGreaterThan(0);
          });
      });

      it('/POST battle/attack', async () => {
        const hero = mockedHero;
        const monsterId = 1;

        return await request(app.getHttpServer())
          .post('/battle/attack')
          .send({ character: hero, monsterId })
          .expect(201, {
            hero,
            monster: {
              ...mockedMonster,
              health: mockedMonster.health - hero.attack,
            },
          });
      });
    });

  describe('LootModule', () => {
    it('/GET /item', async () => {
      return await request(app.getHttpServer())
        .get('/item')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('/POST /item -> /DELETE /item/:id', async () => {
      const item = mockedItem;
      const result = await request(app.getHttpServer())
        .post('/item')
        .send(item)
        .expect(201);

      return await request(app.getHttpServer())
        .delete(`/item/${result.body.id}`)
        .expect(200);
    });

    it('/POST /item -> /PUT /item -> /DELETE /item/:id', async () => {
      const item = mockedItem;
      const postResult = await request(app.getHttpServer())
        .post('/item')
        .send(item)
        .expect(201);

      const putResult = await request(app.getHttpServer())
        .put('/item')
        .send(postResult.body)
        .expect(200);

      return await request(app.getHttpServer())
        .delete(`/item/${putResult.body.id}`)
        .expect(200);
    });

    it('/GET /itemBox', async () => {
      return await request(app.getHttpServer())
        .get('/itemBox')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('/GET /itemBox/top', async () => {
      return await request(app.getHttpServer())
        .get('/itemBox/top')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('/POST /itemBox -> /DELETE /itemBox/:id', async () => {
      const itemBox = mockedItemBox;
      const result = await request(app.getHttpServer())
        .post('/itemBox')
        .send(itemBox)
        .expect(201);

      return await request(app.getHttpServer())
        .delete(`/itemBox/${result.body.id}`)
        .expect(200);
    });

    it('/POST /itemBox -> /PUT /itemBox -> /DELETE /itemBox/:id', async () => {
      const itemBox = mockedItemBox;
      const postResult = await request(app.getHttpServer())
        .post('/itemBox')
        .send(itemBox)
        .expect(201);

      const putResult = await request(app.getHttpServer())
        .put('/itemBox')
        .send(postResult.body)
        .expect(200);

      return await request(app.getHttpServer())
        .delete(`/itemBox/${putResult.body.id}`)
        .expect(200);
    });

    it('/GET /itemBox/:id', async () => {
      const itemBoxId = '4';

      return await request(app.getHttpServer())
        .get(`/itemBox/${itemBoxId}`)
        .expect(200);
    });

    it('/GET /enchant', async () => {
      return await request(app.getHttpServer())
        .get('/enchant')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('/GET /enchant/:id', async () => {
        return await request(app.getHttpServer())
          .get('/enchant/1')
          .expect(200);
      });

    it('/POST /enchant -> /DELETE /enchant/:id', async () => {
      const enchant = mockedEnchant;
      const result = await request(app.getHttpServer())
        .post('/enchant')
        .send(enchant)
        .expect(201);

      return await request(app.getHttpServer())
        .delete(`/enchant/${result.body.id}`)
        .expect(200);
    });

    it('/POST /enchant -> /PUT /enchant -> /DELETE /enchant/:id', async () => {
      const enchant = mockedEnchant;
      const postResult = await request(app.getHttpServer())
        .post('/enchant')
        .send(enchant)
        .expect(201);

      const putResult = await request(app.getHttpServer())
        .put(`/enchant/${postResult.body.id}`)
        .send(postResult.body)
        .expect(200);

      return await request(app.getHttpServer())
        .delete(`/enchant/${putResult.body.id}`)
        .expect(200);
    });

    it('/GET /inventory/:heroId', async () => {
      return await request(app.getHttpServer())
        .get('/inventory/6706a007146bb8469d1bc0d4')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Object);
        });
    });

    it('/GET /inventory/:heroId/:rarity', async () => {
      return await request(app.getHttpServer())
        .get('/inventory/6706a007146bb8469d1bc0d4/common')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Object);
        });
    });

    it('/POST /shop/buy/:itemBoxId', async () => {
      const body = {
        hero: mockedHero,
        price: 500
      };

      return await request(app.getHttpServer())
      .post('/shop/buy/2')
        .send(body)
        .expect(201);
    });

    it('/POST /buyByRarity/:rarity', async () => {
      const body = {
        hero: mockedHero,
        price: 10
      };

      return await request(app.getHttpServer())
      .post('/shop/buyByRarity/common')
        .send(body)
        .expect(201);
    });
  });
});
