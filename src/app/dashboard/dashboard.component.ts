import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { TotalData } from '../common/total-data';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public chartClient: any;
  public chartEvent: any;
  public chartGame: any;
  public chartVoucher: any;
  public totalValue: TotalData = new TotalData();
  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.total();
    this.clientChart();
    this.eventChart();
    this.gameChart();
    this.voucherChart();
  }

  async total() {
    let totalData = await this.dataService.getTaltalData();
    // await this.dataService.getGameData();
    totalData.forEach((data) => {
      if (data.name === 'Client') {
        this.totalValue.client = Number(data.value);
      }
      if (data.name === 'Game') {
        this.totalValue.game = +data.value;
      }
      if (data.name === 'Event') {
        this.totalValue.event = +data.value;
      }
      if (data.name === 'Voucher') {
        this.totalValue.voucher = +data.value;
      }
    });
  }
  async clientChart() {
    let totalData = await this.dataService.getClientData();
    let clientName: string[] = [];
    let eventCount: number[] = [];
    let voucherCount: number[] = [];
    let gameCount: number[] = [];
    let userCount: number[] = [];
    totalData.forEach((data: any) => {
      clientName.push(data.client.name);
      eventCount.push(data.eventData.size);
      data.eventData.forEach((k: any, v: any) => {
        gameCount.push(k.gameData.game.size);
        userCount.push(k.userData.userId.size);
        voucherCount.push(k.couponData.voucher.size);
      });
    });
    // console.log(totalData);
    this.chartClient = new Chart('ClientChart', {
      type: 'bar', //this denotes tha type of chart
      data: {
        // values on X-Axis
        labels: clientName,
        datasets: [
          {
            label: 'Event',
            data: eventCount,
            backgroundColor: 'blue',
          },
          {
            label: 'Game',
            data: gameCount,
            backgroundColor: 'limegreen',
          },
          {
            label: 'User',
            data: userCount,
            backgroundColor: 'violet',
          },
          {
            label: 'Voucher',
            data: voucherCount,
            backgroundColor: 'yellow',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }
  async eventChart() {
    let totalData = await this.dataService.getEventData();
    let eventName: string[] = [];
    let clientName: string[] = [];
    let userCount: number[] = [];
    let voucherCount: number[] = [];
    let gameCount: number[] = [];

    totalData.forEach((element) => {
      eventName.push(`${element.eventName} (${element.client.name})`);
      clientName.push(element.client.name);
      userCount.push(element.userIdList.size);
      voucherCount.push(element.voucherIdList.size);
      gameCount.push(element.gameIdList.size);
    });

    this.chartEvent = new Chart('EventChart', {
      type: 'bar', //this denotes tha type of chart

      data: {
        // values on X-Axis
        labels: eventName,
        datasets: [
          {
            label: 'User',
            data: userCount,
            backgroundColor: 'blue',
          },
          {
            label: 'Voucher (acquired)',
            data: voucherCount,
            backgroundColor: 'limegreen',
          },
          {
            label: 'Game',
            data: gameCount,
            backgroundColor: 'violet',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }
  async gameChart() {
    let totalData = await this.dataService.getGameData();
    let gameName: string[] = [];
    let userCount: number[] = [];
    let voucherCount: number[] = [];
    let eventCount: number[] = [];
    let clientCount: number[] = [];

    totalData.forEach((element) => {
      gameName.push(element.name);
      userCount.push(element.userIdList.size);
      voucherCount.push(element.voucherCount);
      eventCount.push(element.eventIdList.size);
      clientCount.push(element.clientIdList.size);
    });

    this.chartGame = new Chart('GameChart', {
      type: 'bar', //this denotes tha type of chart

      data: {
        // values on X-Axis
        labels: gameName,
        datasets: [
          {
            label: 'User',
            data: userCount,
            backgroundColor: 'blue',
          },
          {
            label: 'Voucher (acquired)',
            data: voucherCount,
            backgroundColor: 'limegreen',
          },
          {
            label: 'Event',
            data: eventCount,
            backgroundColor: 'violet',
          },
          {
            label: 'Client',
            data: clientCount,
            backgroundColor: 'yellow',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }
  async voucherChart() {
    let totalData = await this.dataService.getVoucherData();
    let discountValues: string[] = [];
    let valuesData: number[] = [];

    totalData.forEach((k, v) => {
      valuesData.push(k);
      discountValues.push(v);
    });

    this.chartVoucher = new Chart('VoucherChart', {
      type: 'bar', //this denotes tha type of chart

      data: {
        // values on X-Axis
        labels: discountValues,
        datasets: [
          {
            label: 'Voucher historam',
            data: valuesData,
            backgroundColor: 'blue',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }
}
