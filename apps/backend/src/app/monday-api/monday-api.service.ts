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

const fetchQuery = `
    query ($productBoardId: ID!, $domainBoardId: ID!, $productName: CompareValue!, $domainName: CompareValue!) {
      productBoard: boards(ids: [$productBoardId]) {
        items_page(query_params: {rules: [{column_id: "name", compare_value: $productName, operator: contains_text}]}) {
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
      domainBoard: boards(ids: [$domainBoardId]) {
        items_page(query_params: {rules: [{column_id: "name", compare_value: $domainName, operator: contains_text}]}) {
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

  // Below is the func to fetch data from to tables at once

  private async getTablesData(
    productName: string,
    domainName: string
  ): Promise<any> {
    const variables = {
      productBoardId: 803747785,
      domainBoardId: 472153030,
      productName,
      domainName,
    };

    const response = await axios.post(
      this.apiUrl,
      { query: fetchQuery, variables },
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

  async fecthDataFromTwoTables(productName: string, domainName: string) {
    const items = await this.getTablesData(productName, domainName);
    const product = items.data.productBoard[0].items_page.items.find((item) =>
      item.name.toLowerCase().includes(productName.toLowerCase())
    );

    const domain = items.data.domainBoard[0].items_page.items.find((item) =>
      item.name.toLowerCase().includes(domainName.toLowerCase())
    );

    return { product, domain };
  }

  // ------------------------------------------------------------
  // Test version checking posibilities sending product
  // ------------------------------------------------------------
  async checkIfDomainCanSendProduct(
    productName: string,
    domainName: string
  ): Promise<boolean | string> {
    const data = await this.fecthDataFromTwoTables(productName, domainName);

    const productSending = data.product.column_values.find(
      (column) => column.id === 'text'
    ).text;
    const domainPartner = data.domain.column_values.find(
      (column) => column.id === 'dup__of_status'
    ).text;
    const domainStatus = data.domain.column_values.find(
      (column) => column.id === 'status36'
    ).text;
    const domainESP = data.domain.column_values.find(
      (column) => column.id === 'text6'
    ).text;

    return this.checkDomain(
      productSending,
      domainPartner,
      domainStatus,
      domainESP
    );
  }

  private checkDomain = (
    productSending: string,
    domainPartner: string,
    domainStatus: string,
    domainESP: string
  ): boolean | string => {
    switch (productSending) {
      case 'Everywhere': {
        return true;
      }
      case 'FIT': {
        if (domainPartner === 'FIT') return true;
        return false;
      }
      case 'non FIT': {
        if (domainPartner === 'FIT') return false;
        return true;
      }
      case 'Inception Media Only': {
        if (domainPartner === 'Inception Media, LLC') return true;
        return false;
      }
      case 'EW+DBA': {
        return true;
      }
      case 'ONLY IT2': {
        if (domainESP === 'IT2') return true;
        return false;
      }
      case 'Only EH': {
        if (domainPartner === 'Event Horizon') return true;
        return false;
      }
      case 'non FIT, non killing': {
        if (domainPartner === 'FIT' || domainStatus === 'Killing') return false;
        return true;
      }
      case 'everywhere except FIT': {
        if (domainPartner === 'FIT') return false;
        return true;
      }
      case 'exclude EH': {
        if (domainPartner === 'Event Horizon') return false;
        return true;
      }
      case 'Polaris Only': {
        if (domainPartner === 'Polaris') return true;
        return false;
      }
      case 'EH, PP only': {
        if (
          domainPartner === 'Event Horizon' ||
          domainPartner === 'Prestige Publishing'
        )
          return true;
        return false;
      }
      case 'Everywhere, Except Voluum': {
        if (domainESP === 'IT2') return false;
        return true;
      }
      case 'FIT&PLT': {
        if (domainPartner === 'FIT' || domainPartner === 'Platoon') return true;
        return false;
      }
      default: {
        return 'default';
      }
    }
  };
}
