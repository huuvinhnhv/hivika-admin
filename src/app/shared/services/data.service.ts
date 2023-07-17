import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  baseUrl: string = 'https://cdtkpmnc2023final.azurewebsites.net/api/';
  constructor(private httpClient: HttpClient) {}

  async getClientData() {
    const clientData = await firstValueFrom(this.getData('GetAllClient'));
    const eventData = await firstValueFrom(this.getData('Event'));
    const gameEventData = await firstValueFrom(this.getData('GetAllGameEvent'));
    const gameData = await firstValueFrom(this.getData('GetAllGame'));
    const voucherData = await firstValueFrom(this.getData('GetAllVoucher'));
    const gameDataList = new Map();
    const voucherDataList = new Map();
    const clientDataList = new Map();
    const userDataList = new Map();
    if (voucherData['success'] && voucherData['data'].length > 0) {
      voucherData['data'].forEach((element1: any) => {
        if (element1.userId) {
          voucherDataList.set(element1['eventId'], { voucher: new Set() });
          userDataList.set(element1['eventId'], { userId: new Set() });
        }
      });
      voucherData['data'].forEach((element1: any) => {
        if (element1.userId) {
          let temp1 = voucherDataList.get(element1['eventId']);
          temp1['voucher'].add(element1['id']);
          let temp2 = userDataList.get(element1['eventId']);
          temp2['userId'].add(element1['userId']);
        }
      });
    }
    if (gameEventData['success'] && gameEventData['data'].length > 0) {
      gameEventData['data'].forEach((element1: any) => {
        gameDataList.set(element1['eventId'], { game: new Set() });
      });
      gameEventData['data'].forEach((element1: any) => {
        gameData['data'].forEach((element2: any) => {
          if (element1['gameId'] === element2['gameId']) {
            let temp = gameDataList.get(element1['eventId']);
            temp['game'].add({
              id: element2['gameId'],
              name: element2['name'],
            });
          }
        });
      });
    }

    if (clientData['success'] && clientData['data'].length > 0) {
      for (let i = 0; i < clientData['data'].length; i++) {
        clientDataList.set(clientData['data'][i]['clientId'], {
          client: {
            id: clientData['data'][i]['clientId'],
            name: clientData['data'][i]['clientName'],
          },
          eventData: new Map(),
        });
      }

      for (let i = 0; i < eventData['data'].length; i++) {
        let event = eventData['data'][i];

        let client = clientDataList.get(event['clientId']);
        let game = gameDataList.get(event['clientId']);
        let voucher = voucherDataList.get(event['clientId']);
        let user = userDataList.get(event['clientId']);
        if (
          event['clientId'] === client['client'].id &&
          gameDataList.get(event['clientId'])
        ) {
          client.eventData.set(event.eventId, {
            event: {
              id: event.eventId,
              name: event.name,
            },
            gameData: game,
            couponData: voucher,
            userData: user,
          });
        }
      }
    }
    return Array.from(clientDataList.values());
  }
  async getVoucherData() {
    const voucherData = await firstValueFrom(this.getData('GetAllVoucher'));
    const vouchertDataList = new Map();
    if (voucherData['success'] && voucherData['data'].length > 0) {
      for (let i = 0; i < voucherData['data'].length; i++) {
        if (voucherData['data'][i]['discount']) {
          vouchertDataList.set(
            voucherData['data'][i]['discount'],
            vouchertDataList.has(voucherData['data'][i]['discount'])
              ? vouchertDataList.get(voucherData['data'][i]['discount']) + 1
              : 1
          );
        }
      }
    }
    const sortedArray = Array.from(vouchertDataList).sort(
      (a, b) => a[0] - b[0]
    );
    const sortedMap = new Map(sortedArray);
    return sortedMap;
  }

  async getEventData() {
    const eventData = await firstValueFrom(this.getData('Event'));
    const clientData = await firstValueFrom(this.getData('GetAllClient'));
    const gameEventData = await firstValueFrom(this.getData('GetAllGameEvent'));
    const voucherData = await firstValueFrom(this.getData('GetAllVoucher'));
    const eventDataList = new Map();
    if (clientData['success'] && clientData['data'].length > 0) {
      for (let i = 0; i < eventData['data'].length; i++) {
        eventDataList.set(eventData['data'][i]['eventId'], {
          eventName: eventData['data'][i]['name'],
          client: {
            id: clientData['data'][i]['clientId'],
            name: clientData['data'][i]['clientName'],
          },
          userIdList: new Set(),
          gameIdList: new Set(),
          voucherIdList: new Set(),
        });
      }
    }
    if (gameEventData['success'] && gameEventData['data'].length > 0) {
      for (let i = 0; i < gameEventData['data'].length; i++) {
        const gameEvent = gameEventData['data'][i];
        const event = eventDataList.get(gameEvent.eventId);
        if (event) {
          event.gameIdList.add(gameEvent.gameId);
        }
      }
    }
    if (voucherData['success'] && voucherData['data'].length > 0) {
      voucherData['data']
        .filter((voucher: any) => voucher.gameId && voucher.userId)
        .forEach((voucher: any) => {
          eventDataList.forEach((data: any) => {
            if (data.gameIdList.has(voucher.gameId)) {
              data.userIdList.add(voucher.userId);
            }
          });
        });
      voucherData['data']
        .filter((voucher: any) => voucher.gameId && voucher.userId)
        .forEach((voucher: any) => {
          eventDataList.forEach((data: any) => {
            if (data.client.id === voucher.eventId) {
              data.voucherIdList.add(voucher.id);
            }
          });
        });
    }
    return Array.from(eventDataList.values());
  }
  async getGameData() {
    const gameIdList = new Map();

    const [gameData, voucherData, gameEventData, eventData] = await Promise.all(
      [
        firstValueFrom(this.getData('GetAllGame')),
        firstValueFrom(this.getData('GetAllVoucher')),
        firstValueFrom(this.getData('GetAllGameEvent')),
        firstValueFrom(this.getData('Event')),
      ]
    );

    if (voucherData['success'] && voucherData['data'].length > 0) {
      for (let i = 0; i < gameData['data'].length; i++) {
        gameIdList.set(gameData['data'][i]['gameId'], {
          name: gameData['data'][i]['name'],
          userIdList: new Set(),
          eventIdList: new Set(),
          clientIdList: new Set(),
          voucherCount: 0,
        });
      }

      voucherData['data']
        .filter((voucher: any) => voucher.gameId && voucher.userId)
        .forEach((voucher: any) => {
          const game = gameIdList.get(voucher.gameId);
          if (game) {
            game.userIdList.add(voucher.userId);
            game.voucherCount++;
          }
        });

      for (let i = 0; i < gameEventData['data'].length; i++) {
        const element = gameEventData['data'][i];
        const game = gameIdList.get(element.gameId);
        if (game) {
          game.eventIdList.add(element.eventId);
        }
      }
      gameEventData['data'].forEach((gameEvent: any) => {
        const event = eventData['data'].find(
          (event: any) => event.eventId === gameEvent.eventId
        );
        if (event) {
          const game = gameIdList.get(gameEvent.gameId);
          if (game) {
            game.clientIdList.add(event.clientId);
          }
        }
      });
    }
    return Array.from(gameIdList.values());
  }

  async getTaltalData() {
    const clientCount = await this.getClientCount();
    const gameCount = await this.getGameCount();
    const eventCount = await this.getEventCount();
    const voucherCount = await this.getVoucherCount();

    const data = [
      {
        name: 'Client',
        value: clientCount,
      },
      {
        name: 'Game',
        value: gameCount,
      },
      {
        name: 'Event',
        value: eventCount,
      },
      {
        name: 'Voucher',
        value: voucherCount,
      },
    ];
    return data;
  }

  getAllClients() {
    return this.getData('GetAllClient');
  }

  async getClientCount() {
    const data = await firstValueFrom(this.getData('GetAllClient'));
    if (data['success'] && data['data'].length > 0) {
      return data['data'].length;
    }
    return 0;
  }

  getAllGames() {
    return this.getData('GetAllGame');
  }

  async getGameCount() {
    const data = await firstValueFrom(this.getData('GetAllGame'));
    if (data['success'] && data['data'].length > 0) {
      return data['data'].length;
    }
    return 0;
  }

  getAllEvents() {
    return this.getData('Event');
  }

  async getEventCount() {
    const data = await firstValueFrom(this.getData('Event'));
    if (data['success'] && data['data'].length > 0) {
      return data['data'].length;
    }
    return 0;
  }

  getAllVouchers() {
    return this.getData('GetAllVoucher');
  }

  async getVoucherCount() {
    const data = await firstValueFrom(this.getData('GetAllVoucher'));
    if (data['success'] && data['data'].length > 0) {
      return data['data'].filter((voucher: any) => voucher.userId !== '')
        .length;
    }
    return 0;
  }

  getAllGameEvent() {
    return this.getData('GetAllGameEvent');
  }

  getData(key: string): Observable<any> {
    return this.httpClient
      .get(`${this.baseUrl}${key}`)
      .pipe(map((data) => data));
  }
}
