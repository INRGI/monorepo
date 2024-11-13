import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

const query = `
    query ($boardId: ID!, $value: CompareValue!) {
      boards(ids: [$boardId]) {
        items_page(query_params: {rules: [{column_id: "name", compare_value: $value, operator: contains_text}]}) {
          items {
            id
            name
            column_values {
              id
              text
            }
          }
        }
      }
    }
    `;

@Injectable()
export class MondayApiService {
  private readonly apiUrl: string;
  private readonly mondayToken: string;

  constructor(private readonly configService: ConfigService) {
    this.apiUrl = this.configService.get<string>('MONDAY_URL');
    this.mondayToken = this.configService.get<string>('MONDAY_API_TOKEN');
  }

  private async getProductsItems(productName: string): Promise<any> {
    const variables = {
      boardId: 803747785,
      value: productName,
    };

    const response = await axios.post(
      this.apiUrl,
      { query, variables },
      {
        headers: {
          Authorization: `Bearer ${this.mondayToken}`,
          'Content-Type': 'application/json',
          'API-Version': '2023-07',
        },
      }
    );

    return response.data;
  }

  private async getDomainInfo(domainName: string): Promise<any> {
    const variables = {
      boardId: 472153030,
      value: domainName,
    };

    const response = await axios.post(
      this.apiUrl,
      { query, variables },
      {
        headers: {
          Authorization: `Bearer ${this.mondayToken}`,
          'Content-Type': 'application/json',
          'API-Version': '2023-07',
        },
      }
    );
    return response.data;
  }

  async findDomainByName(domainName: string) {
    const domainInfo = await this.getDomainInfo(domainName);

    const item = domainInfo.data.boards[0].items_page.items.find((item) =>
      item.name.toLowerCase().includes(domainName.toLowerCase())
    );
    return item;
  }

  async findProductByName(productName: string) {
    const items = await this.getProductsItems(productName);
    const item = items.data.boards[0].items_page.items.find((item) =>
      item.name.toLowerCase().includes(productName.toLowerCase())
    );
    return item;
  }

  async fetchProductStatus(productName: string) {
    const items = await this.getProductsItems(productName);
    const item = items.data.boards[0].items_page.items.find((item) =>
      item.name.toLowerCase().includes(productName.toLowerCase())
    );

    return item.column_values.find((column) => column.id === 'status7');
  }

  async fetchProductDomainSending(productName: string) {
    const items = await this.getProductsItems(productName);
    const item = items.data.boards[0].items_page.items.find((item) =>
      item.name.toLowerCase().includes(productName.toLowerCase())
    );

    return item.column_values.find((column) => column.id === 'text');
  }
}
